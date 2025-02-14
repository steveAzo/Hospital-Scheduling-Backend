const CheckIn = require('../models/CheckIn');

/**
 * Fetches the last check-in date for a specific task.
 */
const getLastCheckIn = async (patientId, task) => {
    const checkIn = await CheckIn.findOne({ patient: patientId, task }).sort({ createdAt: -1 });
    return checkIn ? checkIn.createdAt : null;
};

module.exports = { getLastCheckIn };
