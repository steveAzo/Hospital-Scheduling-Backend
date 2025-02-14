const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const moment = require('moment');
const { getLastCheckIn } = require('../utils/lastCheckedIn')

const scheduledTasks = new Map();


const scheduleRemindersForPlan = async (patientId, plan) => {
    try {
        const reminders = await Promise.all(plan.map(async (item) => {
            const newReminder = new Reminder({
                patient: patientId,
                task: item.task,
                frequency: item.frequency,
                duration: item.duration,
                startDate: new Date()
            });

            await newReminder.save();
            console.log('new Reminder', newReminder)
            scheduleReminder(newReminder);
            return newReminder;
        }));

        console.log('reminder', reminders)
        return reminders;
        
    } catch (error) {
        console.error('Error scheduling reminders:', error);
        throw new Error('Failed to schedule reminders');
    }
};

// Function to schedule a single reminder
const scheduleReminder = (reminder) => {
    const { _id, patient, task, frequency, duration, startDate } = reminder;
    console.log('reminder in schedular', reminder)

    let cronExpression;
    if (frequency === 'daily') {
        cronExpression = `0 9 * * *`; 
    } else if (frequency === 'weekly') {
        cronExpression = `0 9 * * 1`; 
    } else if (frequency === 'monthly') {
        cronExpression = `0 9 1 * *`; 
    } else {
        console.error(`Invalid frequency: ${frequency}`);
        return;
    }

    console.log('cron job', cronExpression)

    const job = cron.schedule(cronExpression, async () => {
        const now = moment();
        const endDate = moment(startDate).add(duration, frequency);
        console.log('end date', endDate)

        if (now.isAfter(endDate)) {
            job.stop();
            console.log(`Reminder for ${task} completed`);
            await Reminder.findByIdAndUpdate(_id, { status: 'completed' });
            scheduledTasks.delete(_id.toString());
            return;
        }

        console.log(`Sending reminder: ${task} to patient ${patient}`);

        // If patient does NOT check-in, extend the duration by 1 day
        const lastCheckIn = await getLastCheckIn(patient, task);
        if (!lastCheckIn || moment(lastCheckIn).isBefore(now, 'day')) {
            console.log(`Patient missed check-in, extending reminder by 1 day`);
            await Reminder.findByIdAndUpdate(_id, { duration: duration + 1 });
        }
    });

    scheduledTasks.set(_id.toString(), job);
};


/**
 * Loads all active reminders from the database on server start.
 */
const loadExistingReminders = async () => {
    const activeReminders = await Reminder.find({ status: 'pending' });

    activeReminders.forEach(scheduleReminder);
};

/**
 * Cancels reminders for a patient when they submit a new doctor note.
 */
const cancelRemindersForPatient = async (patientId) => {
    const reminders = await Reminder.find({ patient: patientId, status: 'pending' });

    reminders.forEach((reminder) => {
        if (scheduledTasks.has(reminder._id.toString())) {
            scheduledTasks.get(reminder._id.toString()).stop();
            scheduledTasks.delete(reminder._id.toString());
            console.log(`Cancelled reminder: ${reminder.task}`);
        }
    });

    // Mark reminders as 'cancelled' in the database
    await Reminder.updateMany({ patient: patientId, status: 'pending' }, { status: 'cancelled' });
};

/**
 * Marks a reminder as completed when a patient checks in.
 */
const markReminderAsCompleted = async (reminderId) => {
    if (scheduledTasks.has(reminderId)) {
        scheduledTasks.get(reminderId).stop();
        scheduledTasks.delete(reminderId);
    }

    await Reminder.findByIdAndUpdate(reminderId, { status: 'completed' });
    console.log(`Reminder ${reminderId} marked as completed`);
};

const getReminders = async (patientId, status) => {
    let query = { patient: patientId };
    if (status) query.status = status; 

    return await Reminder.find(query).sort({ startDate: 1 });
};

module.exports = {
    scheduleReminder,
    loadExistingReminders,
    cancelRemindersForPatient,
    markReminderAsCompleted,
    scheduleRemindersForPlan,
    getReminders,
};
