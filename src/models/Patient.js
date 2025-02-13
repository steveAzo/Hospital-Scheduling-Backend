const mongoose = require('mongoose');
const User = require('./User');

const PatientSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Doctor is a user
});

const Patient = User.discriminator('patient', PatientSchema);
module.exports = Patient;
