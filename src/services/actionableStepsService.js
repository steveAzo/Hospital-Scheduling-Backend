const ActionableSteps = require('../models/ActionableSteps');

const getPatientSteps = async (patientId) => {
    console.log(patientId)
    const steps = await ActionableSteps.findOne({ patient: patientId });
    console.log(steps)

    if (!steps) {
        return { checklist: [], plan: [] }; 
    }

    return { checklist: steps.checklist, plan: steps.plan };
};

module.exports = { getPatientSteps };
