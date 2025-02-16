const express = require('express');
const reminderRouter = express.Router();
const { checkIn, getReminders_ } = require('../controllers/reminderController');
const authenticate = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Endpoints for managing patient reminders
 */

/**
 * @swagger
 * /reminders/check-in:
 *   post:
 *     summary: Check-in and trigger scheduled reminders
 *     description: Allows a patient to check in, which starts scheduling relevant reminders.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked in and reminders scheduled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Check-in successful. Reminders scheduled."
 *       401:
 *         description: Unauthorized, only authenticated patients can access this
 */
reminderRouter.post('/check-in', authenticate(['patient']), checkIn);

/**
 * @swagger
 * /reminders/{patientId}:
 *   get:
 *     summary: Retrieve reminders for a patient
 *     description: Fetches the list of scheduled reminders for a given patient.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the patient
 *     responses:
 *       200:
 *         description: Successfully retrieved reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patientId:
 *                   type: string
 *                   example: "65b4a5e8f4b2c91d8c71b3c7"
 *                 reminders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reminderText:
 *                         type: string
 *                         example: "Take medication at 8 AM"
 *                       scheduledTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-15T08:00:00Z"
 *       401:
 *         description: Unauthorized, only authenticated patients and doctors can access this
 *       404:
 *         description: Patient not found or has no reminders
 */
reminderRouter.get('/:patientId', authenticate(['patient', 'doctor']), getReminders_);

module.exports = reminderRouter;
