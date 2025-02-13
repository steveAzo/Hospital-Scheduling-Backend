const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const DoctorNoteSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    encryptedNote: { type: String, required: true }, 
    iv: { type: String, required: true }, 
    checklist: [{ type: String }], 
    plan: [
        {
            task: String,
            frequency: String, 
            duration: Number,
        }
    ],
}, { timestamps: true });

DoctorNoteSchema.methods.encryptNote = function (plainText) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.encryptedNote = encrypted;
    this.iv = iv.toString('hex');
};

DoctorNoteSchema.methods.decryptNote = function () {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), Buffer.from(this.iv, 'hex'));
    let decrypted = decipher.update(this.encryptedNote, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = mongoose.model('DoctorNote', DoctorNoteSchema);
