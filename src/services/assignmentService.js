const User = require('../models/User'); // Single User model

// Assign a doctor to a patient
const assignDoctorService = async (patientId, doctorId) => {
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    const patient = await User.findOne({ _id: patientId, role: 'patient' });

    if (!doctor || !patient) {
        throw new Error('Doctor or Patient not found');
    }

    // Assign the doctor to the patient
    patient.doctor = doctor._id;
    await patient.save();

    // Add patient to the doctor's patient list
    doctor.patients.push(patient._id);
    await doctor.save();

    return { message: 'Doctor assigned successfully' };
};

// Get all patients assigned to a doctor
const getDoctorPatientsService = async (doctorId) => {
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' }).populate('patients', 'name email');
    if (!doctor) throw new Error('Doctor not found');
    
    return doctor.patients;
};

module.exports = { assignDoctorService, getDoctorPatientsService };
