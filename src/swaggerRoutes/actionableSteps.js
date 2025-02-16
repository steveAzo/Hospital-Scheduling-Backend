const express = require('express');
const actionsRouter = express.Router();
const { getPatientActionableSteps } = require('../controllers/actionableStepsController');
const authenticate = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Actionable Steps
 *   description: Endpoints for retrieving actionable steps for patients
 */

/**
 * @swagger
 * /actions/patients/actionable-steps:
 *   get:
 *     summary: Retrieve actionable steps for a patient
 *     description: Fetches a list of recommended actionable steps based on the patient's health records and doctor notes.
 *     tags: [Actionable Steps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved actionable steps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patientId:
 *                   type: string
 *                   example: "65b4a5e8f4b2c91d8c71b3c7"
 *                 actionableSteps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       step:
 *                         type: string
 *                         example: "Take prescribed medication twice daily"
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-20T08:00:00Z"
 *       401:
 *         description: Unauthorized, only authenticated patients can access this
 */
actionsRouter.get('/patients/actionable-steps', authenticate(['patient']), getPatientActionableSteps);

module.exports = actionsRouter;
