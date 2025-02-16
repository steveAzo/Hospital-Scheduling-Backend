const express = require('express');
const { assignDoctor, getDoctorPatients } = require('../controllers/assignmentController');
const authenticate = require('../middlewares/authMiddleware');

const assignmentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Endpoints for patient-doctor assignment
 */

/**
 * @swagger
 * /assignment/assign:
 *   post:
 *     summary: Assign a doctor to a patient
 *     description: Allows a patient to assign themselves to a doctor.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "65b3f0a4d4e3b39d4c76a1b2"
 *               patientId:
 *                 type: string
 *                 example: "65b3f0a4d4e3b39d4c76a1b2"
 *     responses:
 *       200:
 *         description: Doctor successfully assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor assigned successfully"
 *       400:
 *         description: Invalid request or doctor not found
 *       401:
 *         description: Unauthorized, patient login required
 */
assignmentRouter.post('/assign', authenticate(['patient']), assignDoctor);

/**
 * @swagger
 * /assignment/doctor/patients:
 *   get:
 *     summary: Get all patients assigned to a doctor
 *     description: Allows a doctor to retrieve a list of their assigned patients.
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved patient list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   patientId:
 *                     type: string
 *                     example: "65b4a5e8f4b2c91d8c71b3c7"
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "janedoe@example.com"
 *       401:
 *         description: Unauthorized, doctor login required
 */
assignmentRouter.get('/doctor/patients', authenticate(['doctor']), getDoctorPatients);

module.exports = assignmentRouter;
