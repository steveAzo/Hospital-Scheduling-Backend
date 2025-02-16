const express = require('express');
const doctorNotesRouter = express.Router();
const { submitDoctorNote, fetchDoctorNotes, fetchDoctorPatientNotes } = require('../controllers/doctorNotesController');
const authenticate = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Doctor Notes
 *   description: Endpoints for managing doctor notes and patient records
 */

/**
 * @swagger
 * /doctorNotes:
 *   post:
 *     summary: Submit a new doctor note
 *     description: Allows a doctor to submit notes for a patient, extract actionable steps using AI, and schedule reminders.
 *     tags: [Doctor Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "65b4a5e8f4b2c91d8c71b3c7"
 *               note:
 *                 type: string
 *                 example: "Patient shows signs of dehydration. Increase fluid intake and monitor hydration levels."
 *     responses:
 *       201:
 *         description: Doctor note successfully created, actionable steps extracted, and reminders scheduled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor note added, actionable steps extracted, and reminders scheduled."
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized, only authenticated doctors can access this
 */
doctorNotesRouter.post('/', authenticate(['doctor']), submitDoctorNote);

// /**
//  * @swagger
//  * /doctorNotes/{patientId}:
//  *   get:
//  *     summary: Fetch all doctor notes for a specific patient
//  *     description: Retrieves all notes recorded by doctors for a given patient.
//  *     tags: [Doctor Notes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: patientId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The unique ID of the patient
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved doctor notes
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   note:
//  *                     type: string
//  *                     example: "Patient is recovering well. Continue medication for 3 more days."
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *                     example: "2025-02-14T08:30:00Z"
//  *       401:
//  *         description: Unauthorized, only authenticated doctors can access this
//  *       404:
//  *         description: No notes found for this patient
//  */
// doctorNotesRouter.get('/:patientId', authenticate(['doctor']), fetchDoctorNotes);

/**
 * @swagger
 * /doctorNotes/doctors/{doctorId}/patients/{patientId}/notes:
 *   get:
 *     summary: Fetch specific doctor notes for a patient
 *     description: Retrieves notes written by a specific doctor for a given patient.
 *     tags: [Doctor Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the doctor
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the patient
 *     responses:
 *       200:
 *         description: Successfully retrieved doctor notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   note:
 *                     type: string
 *                     example: "Monitor blood pressure daily and reduce salt intake."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-14T08:30:00Z"
 *       401:
 *         description: Unauthorized, only authenticated doctors can access this
 *       404:
 *         description: No notes found for this doctor-patient pair
 */
doctorNotesRouter.get('/doctors/:doctorId/patients/:patientId/notes', authenticate(['doctor', 'patient']), fetchDoctorPatientNotes);

module.exports = doctorNotesRouter;
