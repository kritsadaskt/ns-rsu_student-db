import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../api/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ต้องการลบนักศึกษานี้หรือไม่?')) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toString().includes(searchTerm)
  );

  return (
    <div className="student-list">
      <h2>รายชื่อนักศึกษา</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อหรือรหัสนักศึกษา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>รหัสนักศึกษา</th>
            <th>ชื่อ-สกุล</th>
            <th>อายุ</th>
            <th>เบอร์โทร</th>
            <th>อาจารย์ที่ปรึกษา</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.full_name}</td>
              <td>{student.age}</td>
              <td>{student.phone}</td>
              <td>{student.main_advisor}</td>
              <td>{student.status || 'ไม่ระบุ'}</td>
              <td>
                <Link to={`/students/${student.student_id}`} className="btn-view">
                  ดูรายละเอียด
                </Link>
                <button
                  onClick={() => handleDelete(student.student_id)}
                  className="btn-delete"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudents.length === 0 && (
        <p className="no-data">ไม่พบข้อมูลนักศึกษา</p>
      )}
    </div>
  );
}

export default StudentList;
