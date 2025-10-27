const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Your Vercel frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Supabase Connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('Connected to Supabase database');

// ============= STUDENTS ROUTES =============

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        proposal_exam!proposal_exam_student_id_fkey(
          proposal_exam_id,
          date,
          status,
          edit
        ),
        defense_exam!defense_exam_student_id_fkey(
          defense_exam_id,
          date,
          status,
          edit
        )
      `)
      .order('student_id');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single student
app.get('/api/students/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        proposal_exam!proposal_exam_student_id_fkey(
          proposal_exam_id,
          date,
          status,
          edit
        ),
        defense_exam!defense_exam_student_id_fkey(
          defense_exam_id,
          date,
          status,
          edit
        ),
        citizen_detail!citizen_detail_student_id_fkey(*),
        current_addr!current_addr_student_id_fkey(*)
      `)
      .eq('student_id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      throw error;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
app.post('/api/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([req.body])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Student created', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(req.body)
      .eq('student_id', req.params.id)
      .select();

    if (error) throw error;

    res.json({ message: 'Student updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= COURSE ENROLLMENTS ROUTES =============

// Get courses for a student (student_grades table)
app.get('/api/students/:id/courses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_grades')
      .select(`
        *,
        subjects!student_grades_subject_id_fkey(
          subject_id,
          subject_code,
          subject_name,
          credits
        ),
        academic_terms!student_grades_term_id_fkey(
          term_id,
          academic_year,
          semester,
          calendar_year
        )
      `)
      .eq('student_id', req.params.id)
      .order('grade_id');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add course enrollment (student_grades)
app.post('/api/courses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_grades')
      .insert([req.body])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Course enrollment created', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course enrollment
app.put('/api/courses/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_grades')
      .update(req.body)
      .eq('grade_id', req.params.id)
      .select();

    if (error) throw error;

    res.json({ message: 'Course enrollment updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course enrollment
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('student_grades')
      .delete()
      .eq('grade_id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Course enrollment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= THESIS PROGRESS ROUTES =============

// Update thesis progress (handles both proposal and defense exams)
app.put('/api/thesis/:student_id', async (req, res) => {
  try {
    const studentId = req.params.student_id;
    const { proposal_exam_date, proposal_status, defense_exam_date, defense_status, ...otherData } = req.body;

    // Handle proposal exam
    if (proposal_exam_date !== undefined || proposal_status !== undefined) {
      // Check if proposal exam exists
      const { data: existingProposal } = await supabase
        .from('proposal_exam')
        .select('*')
        .eq('student_id', studentId)
        .single();

      const proposalData = {
        student_id: studentId,
        ...(proposal_exam_date !== undefined && { date: proposal_exam_date }),
        ...(proposal_status !== undefined && { status: proposal_status })
      };

      if (existingProposal) {
        // Update existing
        const { error } = await supabase
          .from('proposal_exam')
          .update(proposalData)
          .eq('student_id', studentId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('proposal_exam')
          .insert([proposalData]);

        if (error) throw error;
      }
    }

    // Handle defense exam
    if (defense_exam_date !== undefined || defense_status !== undefined) {
      // Check if defense exam exists
      const { data: existingDefense } = await supabase
        .from('defense_exam')
        .select('*')
        .eq('student_id', studentId)
        .single();

      const defenseData = {
        student_id: studentId,
        ...(defense_exam_date !== undefined && { date: defense_exam_date }),
        ...(defense_status !== undefined && { status: defense_status })
      };

      if (existingDefense) {
        // Update existing
        const { error } = await supabase
          .from('defense_exam')
          .update(defenseData)
          .eq('student_id', studentId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('defense_exam')
          .insert([defenseData]);

        if (error) throw error;
      }
    }

    // Update student table if there are other fields
    if (Object.keys(otherData).length > 0) {
      const { error } = await supabase
        .from('students')
        .update(otherData)
        .eq('student_id', studentId);

      if (error) throw error;
    }

    res.json({ message: 'Thesis progress updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= STATISTICS ROUTES =============

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const stats = {};

    // Total students
    const { count: totalStudents, error: error1 } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (error1) throw error1;
    stats.totalStudents = totalStudents;

    // Average age
    const { data: ageData, error: error2 } = await supabase
      .from('students')
      .select('age')
      .not('age', 'is', null);

    if (error2) throw error2;

    if (ageData && ageData.length > 0) {
      const totalAge = ageData.reduce((sum, student) => sum + (student.age || 0), 0);
      stats.avgAge = totalAge / ageData.length;
    } else {
      stats.avgAge = 0;
    }

    // Advisors count
    const { data: advisorsData, error: error3 } = await supabase
      .from('students')
      .select('main_advisor');

    if (error3) throw error3;

    const advisorCounts = {};
    advisorsData.forEach(student => {
      if (student.main_advisor) {
        advisorCounts[student.main_advisor] = (advisorCounts[student.main_advisor] || 0) + 1;
      }
    });

    stats.advisors = Object.entries(advisorCounts).map(([main_advisor, count]) => ({
      main_advisor,
      count
    }));

    // Status count
    const { data: statusData, error: error4 } = await supabase
      .from('students')
      .select('status');

    if (error4) throw error4;

    const statusCounts = {};
    statusData.forEach(student => {
      if (student.status) {
        statusCounts[student.status] = (statusCounts[student.status] || 0) + 1;
      }
    });

    stats.statuses = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using Supabase database');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});
