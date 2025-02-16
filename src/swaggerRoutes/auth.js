const express = require('express');
const { signup, login } = require('../controllers/authController');

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication (Signup & Login)
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registers a new user
 *     description: Creates a new user account (Doctor or Patient) with encrypted credentials.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ss123"
 *               role:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: "doctor"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 userId:
 *                   type: string
 *                   example: "65b3f0a4d4e3b39d4c76a1b2"
 *       400:
 *         description: Invalid request or missing fields
 *       409:
 *         description: Email already in use
 */
authRouter.post('/signup', signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ss123"
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', login);

module.exports = authRouter;
