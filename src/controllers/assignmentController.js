const { assignDoctorService, getDoctorPatientsService } = require('../services/assignmentService');

const assignDoctor = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;
        const result = await assignDoctorService(patientId, doctorId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDoctorPatients = async (req, res) => {
    try {
        const patients = await getDoctorPatientsService(req.user.id);
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { assignDoctor, getDoctorPatients };
