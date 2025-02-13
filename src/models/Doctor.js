const mongoose = require('mongoose');
const User = require('./User');

const DoctorSchema = new mongoose.Schema({
    specialization: { type: String, required: true },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Patients are also users
});

const Doctor = User.discriminator('doctor', DoctorSchema);
module.exports = Doctor;
