const { Doctor, Patient } = require('../models/User');

const assignDoctorService = async (patientId, doctorId) => {
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
        throw new Error('Doctor or Patient not found');
    }

    patient.doctor = doctorId;
    await patient.save();

    doctor.patients.push(patientId);
    await doctor.save();

    return { message: 'Doctor assigned successfully' };
};

const getDoctorPatientsService = async (doctorId) => {
    const doctor = await Doctor.findOne({ user: doctorId }).populate('patients', 'user');
    if (!doctor) throw new Error('Doctor not found');
    return doctor.patients;
};

module.exports = { assignDoctorService, getDoctorPatientsService };
