const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Connection
const db = new Database(path.join(__dirname, 'graduate_students.db'));
db.pragma('foreign_keys = ON');

console.log('Connected to SQLite database');

// ============= STUDENTS ROUTES =============

// Get all students
app.get('/api/students', (req, res) => {
  try {
    const query = `
      SELECT s.*, t.proposal_exam_date, t.proposal_status,
             t.defense_exam_date, t.defense_status,
             t.publication_status, t.graduation_notice
      FROM students s
      LEFT JOIN thesis_progress t ON s.student_id = t.student_id
      ORDER BY s.student_id
    `;
    const results = db.prepare(query).all();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single student
app.get('/api/students/:id', (req, res) => {
  try {
    const query = `
      SELECT s.*, t.proposal_exam_date, t.proposal_status,
             t.defense_exam_date, t.defense_status,
             t.publication_status, t.graduation_notice
      FROM students s
      LEFT JOIN thesis_progress t ON s.student_id = t.student_id
      WHERE s.student_id = ?
    `;
    const result = db.prepare(query).get(req.params.id);

    if (!result) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
app.post('/api/students', (req, res) => {
  try {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO students (${columns}) VALUES (${placeholders})`;
    const result = db.prepare(query).run(...values);

    res.status(201).json({ message: 'Student created', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put('/api/students/:id', (req, res) => {
  try {
    const data = req.body;
    const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    const query = `UPDATE students SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE student_id = ?`;
    db.prepare(query).run(...values);

    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  try {
    const query = 'DELETE FROM students WHERE student_id = ?';
    db.prepare(query).run(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= COURSE ENROLLMENTS ROUTES =============

// Get courses for a student
app.get('/api/students/:id/courses', (req, res) => {
  try {
    const query = 'SELECT * FROM course_enrollments WHERE student_id = ? ORDER BY course_code';
    const results = db.prepare(query).all(req.params.id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add course enrollment
app.post('/api/courses', (req, res) => {
  try {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO course_enrollments (${columns}) VALUES (${placeholders})`;
    const result = db.prepare(query).run(...values);

    res.status(201).json({ message: 'Course enrollment created', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course enrollment
app.put('/api/courses/:id', (req, res) => {
  try {
    const data = req.body;
    const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    const query = `UPDATE course_enrollments SET ${sets} WHERE id = ?`;
    db.prepare(query).run(...values);

    res.json({ message: 'Course enrollment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course enrollment
app.delete('/api/courses/:id', (req, res) => {
  try {
    const query = 'DELETE FROM course_enrollments WHERE id = ?';
    db.prepare(query).run(req.params.id);
    res.json({ message: 'Course enrollment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= THESIS PROGRESS ROUTES =============

// Update thesis progress
app.put('/api/thesis/:student_id', (req, res) => {
  try {
    const checkQuery = 'SELECT * FROM thesis_progress WHERE student_id = ?';
    const existing = db.prepare(checkQuery).get(req.params.student_id);

    if (existing) {
      // Update existing
      const data = req.body;
      const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), req.params.student_id];

      const updateQuery = `UPDATE thesis_progress SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE student_id = ?`;
      db.prepare(updateQuery).run(...values);

      res.json({ message: 'Thesis progress updated' });
    } else {
      // Create new
      const data = { ...req.body, student_id: req.params.student_id };
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const insertQuery = `INSERT INTO thesis_progress (${columns}) VALUES (${placeholders})`;
      db.prepare(insertQuery).run(...values);

      res.status(201).json({ message: 'Thesis progress created' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= STATISTICS ROUTES =============

// Get statistics
app.get('/api/statistics', (req, res) => {
  try {
    const stats = {};

    stats.totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    stats.avgAge = db.prepare('SELECT AVG(age) as avgAge FROM students WHERE age IS NOT NULL').get().avgAge;
    stats.advisors = db.prepare('SELECT main_advisor, COUNT(*) as count FROM students GROUP BY main_advisor').all();
    stats.statuses = db.prepare('SELECT status, COUNT(*) as count FROM students GROUP BY status').all();

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using SQLite database: graduate_students.db');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\nDatabase connection closed');
  process.exit(0);
});
