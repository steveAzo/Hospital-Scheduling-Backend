const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
