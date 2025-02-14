const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes')
const notesRoutes = require('./src/routes/doctorNotes')
const actionRoutes = require('./src/routes/actionableStepsRoutes')
const reminderRoutes = require('./src/routes/reminderRoutes')
const bodyParser = require('body-parser')
const connectToDatabase = require('./src/utils/db')

dotenv.config();

PORT = process.env.PORT || 500

const app = express();

app.use(bodyParser.json({limit: '50mb'}))

app.use('/auth', authRoutes);
app.use('/assignment', assignmentRoutes)
app.use('/doctorNotes', notesRoutes)
app.use('/actions', actionRoutes)
app.use('/reminders', reminderRoutes)


connectToDatabase()

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

