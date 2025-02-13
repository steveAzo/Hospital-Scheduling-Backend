const express = require('express');
const actionsRouter = express.Router();
const { getPatientActionableSteps } = require('../controllers/actionableStepsController');
const authenticate = require('../middlewares/authMiddleware');

actionsRouter.get('/patients/actionable-steps', authenticate(['patient']), getPatientActionableSteps);

module.exports = actionsRouter;
