// server.js - Node.js + Express + MongoDB
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentsdb';

// suppress upcoming Mongoose strictQuery change warning (optional)
mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    // start server only after DB connected
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB error:', err);
  });

// 2. Mongoose Schema Definition
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  // 🛑 CHANGE: Removed 'required: true' AND added empty string '' to enum list 
  // This allows the field to be optional AND accepts an empty string from the frontend.
  department: { type: String, enum: ['IT', 'CSE', 'AIDS', 'CET', ''] }, 
  // 🛑 CHANGE: Removed 'required: true'. Section will be omitted if not sent, 
  // but will fail if sent as a non-number or non-enum value (e.g., empty string).
  section: { type: Number, enum: [1, 2, 3] }, 
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// 3. API Routes
// Route to save a new student - IMPROVED ERROR HANDLING
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    // Use 201 Created status for a successful POST operation
    res.status(201).json({ message: '✅ Student saved', student: savedStudent });
  } catch (err) {
    console.error("Save Error Details:", err);
    
    // Check if it's a Mongoose Validation Error
    if (err.name === 'ValidationError') {
      // Map the validation errors for detailed client feedback
      const errors = Object.values(err.errors).map(val => val.message);
      
      // Send 400 Bad Request for client-side input issues
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Handle all other unexpected errors
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// Route to list all students
app.get('/students', async (req, res) => {
  try {
    const list = await Student.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// 4. Start Server is handled after DB connection above