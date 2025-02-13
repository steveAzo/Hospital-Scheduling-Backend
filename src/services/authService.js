const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const registerUser = async (name, email, password, role) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const user = await User.create({ name, email, password, role });
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