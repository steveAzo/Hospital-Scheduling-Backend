const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Middleware to authenticate users and enforce role-based access control
 * @param {Array} allowedRoles - Roles permitted to access the route
 */
const authenticate = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ error: 'Access denied' });

        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            req.user = decoded; // Attach user data to request

            // If roles are specified, enforce access control
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            next(); // Proceed to the next middleware
        } catch (error) {
            res.status(400).json({ error: 'Invalid token' });
        }
    };
};

module.exports = authenticate;
