const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes')
const bodyParser = require('body-parser')
const connectToDatabase = require('./src/utils/db')

dotenv.config();

PORT = process.env.PORT || 5000

const app = express();

app.use(bodyParser.json({limit: '50mb'}))

app.use('/auth', authRoutes);
app.use('/assignment', assignmentRoutes)

connectToDatabase()

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

