const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reminder: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
