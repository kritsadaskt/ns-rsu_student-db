import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import AddStudent from './components/AddStudent';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>ระบบจัดการข้อมูลนักศึกษาปริญญาโท</h1>
          <div className="nav-links">
            <Link to="/">หน้าหลัก</Link>
            <Link to="/students">รายชื่อนักศึกษา</Link>
            <Link to="/add-student">เพิ่มนักศึกษา</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/add-student" element={<AddStudent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
