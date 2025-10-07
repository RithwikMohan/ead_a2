import React, { useState } from 'react'; // [cite: 207]
import './App.css'; // [cite: 208]

function App() {
  const [form, setForm] = useState({
    name: '', rollNo: '', gender: '', department: '', section: '', skills: []
  }); // [cite: 211]
  const [message, setMessage] = useState(null); // [cite: 213]
  const API = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // [cite: 214]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // [cite: 219]
  };

  const handleSkills = (e) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev, 
      skills: checked ? [...prev.skills, value] : prev.skills.filter(s => s !== value) // [cite: 225]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(null);
    try {
      const res = await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // [cite: 237]
        body: JSON.stringify(form) 
      });
      const data = await res.json(); // [cite: 240]
      if (!res.ok) throw new Error(data.error || 'Save failed'); // [cite: 241]
      setMessage('✅ Student saved successfully!'); // [cite: 242]
      // Reset form after successful submission
      setForm({ name: '', rollNo: '', gender: '', department: '', section: '', skills: [] }); // [cite: 243]
    } catch (err) {
      setMessage('❌ ' + err.message); // [cite: 245]
    }
  };

  // JSX for the form [cite: 251]
  return (
    <div className="form-container">
      <h2>Student Registration</h2> 
      {message && <p className="msg">{message}</p>} 
      <form onSubmit={handleSubmit}>
        <label>Name</label> 
        <input name="name" value={form.name} onChange={handleChange} required /> 

        <label>Roll No</label> 
        <input name="rollNo" value={form.rollNo} onChange={handleChange} required /> 

        <label>Gender</label> 
        <div className="radio-group">
          <label><input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange} required /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange} /> Female</label>
        </div>

        

        

        <label>Skills</label> 
        <div className="checkbox-group">
          {['C', 'C++', 'Java', 'JS', 'Ruby'].map(s => ( 
            <label key={s}><input type="checkbox" value={s} checked={form.skills.includes(s)} onChange={handleSkills} /> {s}</label>
          ))}
        </div>

        <button type="submit">Save Student</button> 
      </form>
    </div>
  );
}

export default App;