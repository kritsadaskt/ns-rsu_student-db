import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import AddStudent from './components/AddStudent';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const handleAddStudentSuccess = () => {
    // Refresh the page or update the student list
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>ระบบจัดการข้อมูลนักศึกษาปริญญาโท</h1>
          <div className="nav-links">
            <Link to="/">หน้าหลัก</Link>
            <Link to="/students">รายชื่อนักศึกษา</Link>
            <button
              className="btn-add"
              onClick={() => setIsAddStudentOpen(true)}
              style={{ marginLeft: '0' }}
            >
              เพิ่มนักศึกษา
            </button>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
          </Routes>
        </div>

        {/* Add Student Modal */}
        <AddStudent
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          onSuccess={handleAddStudentSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
