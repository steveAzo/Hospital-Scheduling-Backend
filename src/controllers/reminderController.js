const CheckIn = require('../models/CheckIn');
const { markReminderAsCompleted, getReminders } = require('../services/reminderService');




/**
 * Patient checks in, completing a reminder.
 */
const checkIn = async (req, res) => {
    const { patientId, reminderId } = req.body;

    try {
        // Log check-in
        await CheckIn.create({ patient: patientId, reminder: reminderId });

        await markReminderAsCompleted(reminderId);

        return res.status(200).json({ message: 'Check-in successful, reminder completed' });
    } catch (error) {
        console.error('Check-in failed:', error);
        return res.status(500).json({ message: 'Check-in failed' });
    }
};


const getReminders_ = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query; // Optional filter

        const reminders = await getReminders(patientId, status);
        res.status(200).json({ success: true, reminders });
    } catch (error) {
        console.error('Error retrieving reminders:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve reminders' });
    }
};

module.exports = { checkIn, getReminders_ };
