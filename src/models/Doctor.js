const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});

const Doctor = mongoose.model('Doctor', DoctorSchema);