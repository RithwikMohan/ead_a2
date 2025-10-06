// server.js - Node.js + Express + MongoDB
require('dotenv').config(); // [cite: 147]
const express = require('express'); // [cite: 148]
const mongoose = require('mongoose'); // [cite: 149]
const cors = require('cors'); // [cite: 150]
const app = express(); // [cite: 151]
app.use(cors()); // [cite: 152]
app.use(express.json()); // [cite: 153]

// 1. MongoDB Connection [cite: 154]
const PORT = process.env.PORT || 4000; // [cite: 197]
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentsdb'; // [cite: 155]

// suppress upcoming Mongoose strictQuery change warning (optional)
mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // [cite: 156]
  .then(() => {
    console.log('✅ MongoDB connected'); // [cite: 157]
    // start server only after DB connected
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB error:', err); // [cite: 158]
  });

// 2. Mongoose Schema Definition [cite: 159, 160]
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // [cite: 161]
  rollNo: { type: String, required: true }, // [cite: 162]
  gender: { type: String, enum: ['Male', 'Female'], required: true }, // [cite: 163]
  department: { type: String, enum: ['IT', 'CSE', 'AIDS', 'CET'], required: true }, // [cite: 164]
  section: { type: Number, enum: [1, 2, 3], required: true }, // [cite: 165]
  skills: [{ type: String }], // [cite: 166]
  createdAt: { type: Date, default: Date.now } // [cite: 167]
});

const Student = mongoose.model('Student', studentSchema); // [cite: 169]

// 3. API Routes [cite: 172]
// Route to save a new student [cite: 173]
app.post('/students', async (req, res) => { // [cite: 174]
  try {
    const student = new Student(req.body); // [cite: 176]
    await student.save(); // [cite: 177]
    res.json({ message: '✅ Student saved', student }); // [cite: 178]
  } catch (err) {
    console.error(err); // [cite: 180]
    res.status(500).json({ error: 'Save failed' }); // [cite: 181]
  }
});

// Route to list all students [cite: 184]
app.get('/students', async (req, res) => { // [cite: 185]
  try {
    const list = await Student.find().sort({ createdAt: -1 }); // [cite: 187]
    res.json(list); // [cite: 188]
  } catch (err) {
    console.error(err); // [cite: 190]
    res.status(500).json({ error: 'Fetch failed' }); // [cite: 191]
  }
});

// 4. Start Server is handled after DB connection above