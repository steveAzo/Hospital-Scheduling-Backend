const axios = require('axios');
const ActionableSteps = require('../models/ActionableSteps');
const { scheduleRemindersForPlan } = require('../services/reminderService')
const dotenv = require('dotenv');
dotenv.config();

const processDoctorNote = async (patientId, doctorNoteId, decryptedNote) => {
    try {
        const prompt = `Extract actionable steps from this medical note and categorize them into:
                1. Checklist (immediate one-time tasks): Each item should start with "-".
                2. Plan (schedule of actions): Each item should start with "-" and include the frequency and duration (e.g., "Monitor temperature daily for 3 days").
                Medical note:\n${decryptedNote}`;

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { params: { key: process.env.GEMINI_API_KEY } }
        );

        const result = response.data.candidates[0].content.parts[0].text;


        const checklist = [];
        const plan = [];

        const lines = result.split('\n');

        let isChecklist = false;
        let isPlan = false;

        for (const line of lines) {
            // Check if the line indicates the start of the checklist
            if (line.toLowerCase().includes('checklist')) {
                isChecklist = true;
                isPlan = false;
                continue; 
            }

            if (line.toLowerCase().includes('plan')) {
                isPlan = true;
                isChecklist = false;
                continue; // Skip the section header line
            }

            if (isChecklist && (line.startsWith('*') || line.startsWith('-'))) {
                checklist.push(line.replace(/[*\-]/, '').trim()); 
            }

            if (isPlan && (line.startsWith('*') || line.startsWith('-'))) {
                const task = line.replace(/[*\-]/, '').trim();

                const frequencyMatch = task.match(/(daily|weekly|monthly)/i);
                const durationMatch = task.match(/\d+/);

                const frequency = frequencyMatch ? frequencyMatch[0] : 'daily';
                const duration = durationMatch ? parseInt(durationMatch[0]) : 1;

                plan.push({ task, frequency, duration });
            }
        }

        // Save to MongoDB
        await ActionableSteps.create({ patient: patientId, doctorNote: doctorNoteId, checklist, plan });

        // Schedule the reminders
        console.log('function called')
        await scheduleRemindersForPlan(patientId, plan);

        return { checklist, plan };
    } catch (error) {
        console.error('Error processing doctor note:', error);
        throw new Error('Failed to process doctor note');
    }
};
module.exports = { processDoctorNote };
