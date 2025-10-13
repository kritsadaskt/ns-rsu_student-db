import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, updateStudent, getStudentCourses, updateThesisProgress } from '../api/api';
import CourseEnrollment from './CourseEnrollment';
import ThesisProgress from './ThesisProgress';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const studentRes = await getStudent(id);
      const coursesRes = await getStudentCourses(id);
      setStudent(studentRes.data);
      setCourses(coursesRes.data);
      setFormData(studentRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(id, formData);
      setIsEditing(false);
      loadData();
      alert('อัปเดตข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  const handleThesisUpdate = async (thesisData) => {
    try {
      await updateThesisProgress(id, thesisData);
      loadData();
      alert('อัปเดตความคืบหน้าวิทยานิพนธ์สำเร็จ');
    } catch (error) {
      console.error('Error updating thesis:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  if (!student) return <div>กำลังโหลด...</div>;

  return (
    <div className="student-detail">
      <button onClick={() => navigate('/students')} className="btn-back">
        ← กลับ
      </button>

      <h2>รายละเอียดนักศึกษา - {student.student_id}</h2>

      {!isEditing ? (
        <div className="detail-view">
          <div className="info-grid">
            <div className="info-item">
              <label>รหัสนักศึกษา:</label>
              <span>{student.student_id}</span>
            </div>
            <div className="info-item">
              <label>ชื่อ-สกุล:</label>
              <span>{student.full_name}</span>
            </div>
            <div className="info-item">
              <label>วันเกิด:</label>
              <span>{student.birth_date}</span>
            </div>
            <div className="info-item">
              <label>อายุ:</label>
              <span>{student.age} ปี</span>
            </div>
            <div className="info-item">
              <label>เลขบัตรประชาชน:</label>
              <span>{student.national_id}</span>
            </div>
            <div className="info-item">
              <label>เบอร์โทรศัพท์:</label>
              <span>{student.phone}</span>
            </div>
            <div className="info-item">
              <label>อีเมล:</label>
              <span>{student.email}</span>
            </div>
            <div className="info-item">
              <label>ที่อยู่ปัจจุบัน:</label>
              <span>{student.current_address}</span>
            </div>
            <div className="info-item">
              <label>จบการศึกษาจาก:</label>
              <span>{student.undergraduate_from}</span>
            </div>
            <div className="info-item">
              <label>GPA ป.ตรี:</label>
              <span>{student.undergraduate_gpa}</span>
            </div>
            <div className="info-item">
              <label>เลขที่ใบประกอบวิชาชีพ:</label>
              <span>{student.professional_license}</span>
            </div>
            <div className="info-item">
              <label>ที่ทำงานปัจจุบัน:</label>
              <span>{student.current_workplace}</span>
            </div>
            <div className="info-item">
              <label>อาจารย์ที่ปรึกษาหลัก:</label>
              <span>{student.main_advisor}</span>
            </div>
            <div className="info-item">
              <label>อาจารย์ที่ปรึกษาร่วม:</label>
              <span>{student.co_advisor}</span>
            </div>
            <div className="info-item">
              <label>สถานะ:</label>
              <span>{student.status}</span>
            </div>
          </div>

          <button onClick={() => setIsEditing(true)} className="btn-edit">
            แก้ไขข้อมูล
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label>ชื่อ-สกุล:</label>
              <input
                type="text"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>อายุ:</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>เบอร์โทรศัพท์:</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>อีเมล:</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ที่ทำงานปัจจุบัน:</label>
              <input
                type="text"
                value={formData.current_workplace || ''}
                onChange={(e) => setFormData({ ...formData, current_workplace: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>อาจารย์ที่ปรึกษาหลัก:</label>
              <input
                type="text"
                value={formData.main_advisor || ''}
                onChange={(e) => setFormData({ ...formData, main_advisor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>สถานะ:</label>
              <input
                type="text"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">บันทึก</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <ThesisProgress student={student} onUpdate={handleThesisUpdate} />
      <CourseEnrollment studentId={id} courses={courses} onUpdate={loadData} />
    </div>
  );
}

export default StudentDetail;
