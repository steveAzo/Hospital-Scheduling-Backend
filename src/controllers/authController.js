const { registerUser, loginUser } = require('../services/authService');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await registerUser(name, email, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signup, login };
