const PatientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { User, Doctor, Patient };