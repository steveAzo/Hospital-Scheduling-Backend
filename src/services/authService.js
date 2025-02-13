const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import all models
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient')
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const registerUser = async (name, email, password, role, specialization, extraData = {}) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    let user;

    if (role === 'doctor') {
        user = new Doctor({ name, email, password, specialization });
    } else if (role === 'patient') {
        user = new Patient({ name, email, password });
    } else {
        throw new Error('Invalid role');
    }

    await user.save();
    return { user, token: generateToken(user) };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }
    return { user, token: generateToken(user) };
};

module.exports = { registerUser, loginUser };
