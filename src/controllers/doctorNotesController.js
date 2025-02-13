const doctorNotesService = require('../services/doctorNotesService');

const addDoctorNote = async (req, res) => {
    try {
        const { patientId, note } = req.body;
        const doctorId = req.user.id; 

        if (!patientId || !note) {
            return res.status(400).json({ error: 'Patient ID and note are required' });
        }

        const response = await doctorNotesService.createDoctorNote(doctorId, patientId, note);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const submitDoctorNote = async (req, res) => {
    try {
        const { patientId, note } = req.body;
        const doctorId = req.user.id; 

        const result = await doctorNotesService.submitDoctorNote(doctorId, patientId, note);
        res.status(201).json({ message: 'Doctor note submitted successfully', ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchDoctorNotes = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user.id;

        const notes = await doctorNotesService.getDoctorNotes(doctorId, patientId);
        return res.status(200).json({ notes });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const fetchDoctorPatientNotes = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;

        const notesData = await doctorNotesService.getDoctorPatientNotes(doctorId, patientId);

        res.json(notesData);
    } catch (error) {
        console.error('Error retrieving doctor notes:', error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addDoctorNote, fetchDoctorNotes, submitDoctorNote, fetchDoctorPatientNotes };
