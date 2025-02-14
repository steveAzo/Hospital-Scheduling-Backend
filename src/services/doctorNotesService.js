const DoctorNotes = require('../models/DoctorNote');
const  { processDoctorNote }  = require('../utils/aiService')
const ActionableSteps = require('../models/ActionableSteps')
const Reminder = require('../models/Reminder')


const createDoctorNote = async (doctorId, patientId, note) => {
    const doctorNote = new DoctorNotes({
        doctor: doctorId,
        patient: patientId,
    });


    // Encrypt the note using the instance method
    doctorNote.encryptNote(note);

    // Save the instance to the database
    await doctorNote.save();
    return { message: 'Doctor note added successfully' };
};

const submitDoctorNote = async (doctorId, patientId, note) => {
    const doctorNote = new DoctorNotes({ doctor: doctorId, patient: patientId });

    doctorNote.encryptNote(note);
    console.log(doctorNote)
    await doctorNote.save();

    // Decrypt the note for AI processing
    const decryptedNote = doctorNote.decryptNote();


    // Delete any previous actionable steps and reminders for this patient
    await ActionableSteps.deleteMany({ patient: patientId });
    await Reminder.deleteMany({ patient: patientId });

    // Send decrypted note to AI, extract checklist & plan
    const { checklist, plan } = await processDoctorNote(patientId, doctorNote._id, decryptedNote);

    return { message: 'Doctor note submitted successfully', checklist, plan };
};

const getDoctorNotes = async (doctorId, patientId) => {
    // Fetch notes from the database
    const notes = await DoctorNotes.findOne({ doctor: doctorId, patient: patientId }).sort({ createdAt: -1 });

    if (!notes.length) {
        throw new Error('No notes found for this patient.');
    }

    return { note: note.decryptNote() };
};


const getDoctorPatientNotes = async (doctorId, patientId) => {
    const doctorNotes = await DoctorNotes.find({ doctor: doctorId, patient: patientId });

    if (!doctorNotes.length) {
        return { doctorNotes: [], checklist: [], plan: [] };
    }

    const actionableSteps = await ActionableSteps.findOne({ patient: patientId });

    return {
        doctorNotes: doctorNotes.map(note => ({
            id: note._id,
            note: note.decryptNote(), // Decrypt note before returning
            createdAt: note.createdAt
        })),
        checklist: actionableSteps?.checklist || [],
        plan: actionableSteps?.plan || []
    };
};

module.exports = { createDoctorNote, getDoctorNotes, submitDoctorNote, getDoctorPatientNotes };
