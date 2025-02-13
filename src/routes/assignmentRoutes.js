const express = require('express');
const { assignDoctor, getDoctorPatients } = require('../controllers/assignmentController');
const authenticate = require('../middlewares/authMiddleware');
const assignmentRouter = express.Router();

assignmentRouter.post('/assign', authenticate(['patient']), assignDoctor);
assignmentRouter.get('/doctor/patients', authenticate(['doctor']), getDoctorPatients);

module.exports = assignmentRouter