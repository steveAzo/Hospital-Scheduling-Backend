const express = require('express');
const doctorNotesRouter = express.Router();
const { addDoctorNote, fetchDoctorNotes, submitDoctorNote, fetchDoctorPatientNotes} = require('../controllers/doctorNotesController');
const authenticate = require('../middlewares/authMiddleware');

// doctorNotesRouter.post('/', authenticate(['doctor']), addDoctorNote);
doctorNotesRouter.post('/', authenticate(['doctor']), submitDoctorNote );
doctorNotesRouter.get('/:patientId', authenticate(['doctor']), fetchDoctorNotes);
doctorNotesRouter.get('/doctors/:doctorId/patients/:patientId/notes', authenticate(['doctor']), fetchDoctorPatientNotes);


module.exports = doctorNotesRouter;
