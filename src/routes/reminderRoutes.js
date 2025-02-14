const express = require('express');
const reminderRouter = express.Router();
const { checkIn, getReminders_ } = require('../controllers/reminderController');
const authenticate  = require('../middlewares/authMiddleware');

reminderRouter.post('/check-in', authenticate(['patient']), checkIn);
reminderRouter.get('/:patientId', authenticate(['patient', 'doctor']), getReminders_)

module.exports = reminderRouter;
