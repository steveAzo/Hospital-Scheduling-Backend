const ActionableSteps = require('../models/ActionableSteps');

const getPatientSteps = async (patientId) => {
    const steps = await ActionableSteps.findOne({ patient: patientId });

    if (!steps) {
        return { checklist: [], plan: [] }; 
    }

    return { checklist: steps.checklist, plan: steps.plan };
};

module.exports = { getPatientSteps };
