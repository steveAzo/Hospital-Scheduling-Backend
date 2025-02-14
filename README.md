# **Hospital Backend System Documentation**

## **Table of Contents**
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Database Choice](#database-choice)
4. [Authentication (JWT)](#authentication-jwt)
5. [Core Features](#core-features)
6. [API Endpoints](#api-endpoints)
    - [Auth Routes](#auth-routes)
    - [Assignments](#assignment-routes)
    - [Doctor Notes](#doctor-notes-routes)
    - [Reminders](#reminder-routes)
    - [Actionable Steps](#actionable-steps)
7. [Detailed Breakdown of `submitDoctorNote`](#detailed-breakdown-of-submitdoctornote)
8. [Setup Instructions](#setup-instructions)

---

## **Project Overview**
The Hospital Backend System provides **secure** and **efficient** management of doctor-patient interactions. Key functionalities include:
- **User authentication** (patients and doctors)
- **Doctor assignment** to patients
- **Secure doctor notes submission** (including AI-based analysis and scheduling)
- **Automated reminders and patient check-ins**
- **Actionable steps generation using AI**

Built using **Node.js (Express) and MongoDB**, the backend ensures **scalability, security, and modularity**.

---

## **Folder Structure**
```bash
src/
│── controllers/    # Handles HTTP requests
│── services/       # Business logic (separation of concerns)
│── models/         # Mongoose models
│── routes/         # API route definitions
│── middleware/     # Authentication and request validation
│── utils/          # Helper functions (e.g., encryption, AI integration, database)
│── config/         # Configuration files (e.g., database, JWT secrets)
│── cronJobs/       # Scheduled tasks (e.g., reminders)
│── server.js       # Main application entry point
```

---

## **Database Choice**
**MongoDB** was chosen due to:
- **Scalability**: Supports flexible schema for storing medical records.
- **Document-based storage**: Stores patient data as JSON-like documents.
- **Indexing & Query Optimization**: Ensures fast lookups for doctor-patient interactions.
- **Ease of Integration**: Works well with Node.js.

### **Key Models**
#### **User Model** (`models/User.js`)
```js
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Hashed
    role: { type: String, enum: ['patient', 'doctor'] },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
```
#### **Doctor Notes Model** (`models/DoctorNote.js`)
```js
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

```

### Data Encryption for Doctor Notes

To ensure **patient confidentiality and data security**, doctor notes are encrypted before storage. We use **AES-256 encryption**, a widely accepted industry standard for securing sensitive data.

####  How It Works:
1. **Encryption**:  
   - Before saving, the doctor’s note is encrypted using **AES-256-CBC**.  
   - A **random IV (Initialization Vector)** is generated for each encryption to enhance security.  
   - The **encryption key** is securely stored in environment variables (`process.env.ENCRYPTION_KEY`).

2. **Decryption**:  
   - When a **doctor retrieves notes**, the system decrypts them using the stored key and IV.  
   - Only **authorized users (doctor or patient)** can access the decrypted content.

####  Why AES-256?  
**Strong Security** – Resistant to brute-force attacks.  
**Fast Performance** – Efficient even for large texts.  
**Widely Used** – Standard encryption for sensitive data.

---
---

## **Authentication (JWT)**
**JSON Web Tokens (JWT)** are used for authentication:
- **Login generates a JWT** (stored client-side).
- **Middleware (`authenticate.js`) verifies the token** before accessing protected routes.

```js
const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!roles.includes(decoded.role)) return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
```

## User Model & Role-Based Access Control (RBAC)

### Why We Use the Discriminator Approach  
In our system, we have **different types of users** with distinct roles and permissions:  
- **Doctors** – Can manage patient notes, view assigned patients, and create treatment plans.  
- **Patients** – Can check in, receive reminders, and view their own medical records.  
-  **Admins (if needed in the future)** – Can oversee system operations.

Since these user types **share common attributes** (e.g., `email`, `password`, `name`) but also have **role-specific data**, we use **MongoDB discriminators**.  
This allows **efficient schema inheritance**, avoiding redundancy while keeping role-specific fields **separate yet linked**.

---


---

## **Core Features**
1. **User Authentication**: Signup/Login using JWT.
2. **Doctor-Patient Assignments**: Patients can request a doctor.
3. **Secure Doctor Notes**: Notes are stored with encryption.
4. **AI-Based Actionable Steps**: Extracts patient follow-up actions.
5. **Automated Reminders**: Scheduled patient check-ins.

---

## **API Endpoints**
### **Auth Routes** (`/auth`)
| Method | Route       | Description        |
|--------|------------|--------------------|
| POST   | `/signup`  | User registration |
| POST   | `/login`   | User authentication |

### **Assignment Routes** (`/assignment`)
| Method | Route                 | Description |
|--------|------------------------|-------------|
| POST   | `/assign`              | Assigns a doctor to a patient |
| GET    | `/doctor/patients`     | Fetch patients assigned to a doctor |

### **Doctor Notes Routes** (`/doctorNotes`)
| Method | Route                                        | Description |
|--------|---------------------------------------------|-------------|
| POST   | `/`                                        | Submit doctor note (with AI & encryption) |
| GET    | `/:patientId`                              | Fetch notes for a patient |
| GET    | `/doctors/:doctorId/patients/:patientId/notes` | Fetch specific doctor-patient notes |

### **Reminder Routes** (`/reminders`)
| Method | Route        | Description |
|--------|-------------|-------------|
| POST   | `/check-in` | Patient check-in |
| GET    | `/:patientId` | Get patient reminders |

### **Actionable Steps** (`/actions`)
| Method | Route                         | Description |
|--------|-------------------------------|-------------|
| GET    | `/patients/actionable-steps`  | Get AI-generated steps |

---

## **Detailed Breakdown of `submitDoctorNote`**
### **How It Works:**
1. **Doctor submits a note**
2. **AI analyzes the note** (extracts key steps)
3. **Actionable steps are generated**
4. **Reminders are scheduled**
5. **Data is stored securely** (encryption applied if required)

```js
const submitDoctorNote = async (doctorId, patientId, note) => {
    const doctorNote = new DoctorNotes({ doctor: doctorId, patient: patientId });

    doctorNote.encryptNote(note);
    console.log(doctorNote)
    await doctorNote.save();

    // Decrypt the note for AI processing
    const decryptedNote = doctorNote.decryptNote();


    // Delete any previous actionable steps and reminders for this patient
    await ActionableSteps.deleteMany({ patient: patientId });
    await Reminder.deleteMany({ patient: patientId });

    // Send decrypted note to AI, extract checklist & plan
    const { checklist, plan } = await processDoctorNote(patientId, doctorNote._id, decryptedNote);

    return { message: 'Doctor note submitted successfully', checklist, plan };
};
```

---

## **Setup Instructions**
### **1. Clone Repository**
```sh
git clone <repo-url>
cd hospital-backend
```
### **2. Install Dependencies**
```sh
npm install
```
### **3. Set Up Environment Variables (`.env`)**
```env
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
ENCRYPTION_KEY=<your_encryption_key>
GEMINI_API=<your_gemini_api_key>
```
### **4. Start Server**
```sh
npm start
```
---

### **Conclusion**
This documentation ensures clarity for **frontend developers and graders** and the **Quality Assurance Team**.

