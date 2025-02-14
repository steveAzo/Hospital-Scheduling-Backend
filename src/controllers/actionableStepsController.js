const { getPatientSteps } = require('../services/actionableStepsService');

const getPatientActionableSteps = async (req, res) => {
    try {
        const patientId = req.user.id;

        const steps = await getPatientSteps(patientId);

        res.json(steps);
    } catch (error) {
        console.error('Error retrieving actionable steps:', error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getPatientActionableSteps };
