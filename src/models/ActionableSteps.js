const mongoose = require('mongoose');

const ActionableStepsSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorNote: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorNote', required: true },
    checklist: [{ type: String }], // Immediate actions
    plan: [
        {
            task: { type: String, required: true },  
            frequency: { type: String, required: true }, 
            duration: { type: Number, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActionableSteps', ActionableStepsSchema);
