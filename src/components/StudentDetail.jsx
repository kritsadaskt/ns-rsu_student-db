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

  const fullName = `${student.prefix || ''} ${student.first_name || ''} ${student.last_name || ''}`.trim();

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
              <span>{fullName}</span>
            </div>
            <div className="info-item">
              <label>อายุ:</label>
              <span>{student.age} ปี</span>
            </div>
            <div className="info-item">
              <label>เลขบัตรประชาชน:</label>
              <span>{student.citizen_id}</span>
            </div>
            <div className="info-item">
              <label>เบอร์โทรศัพท์:</label>
              <span>{student.tel}</span>
            </div>
            <div className="info-item">
              <label>อีเมลส่วนตัว:</label>
              <span>{student.personal_email}</span>
            </div>
            <div className="info-item">
              <label>อีเมล RSU:</label>
              <span>{student.rsu_email}</span>
            </div>
            <div className="info-item">
              <label>จบการศึกษาจาก:</label>
              <span>{student.graduated_from}</span>
            </div>
            <div className="info-item">
              <label>GPA:</label>
              <span>{student.gpa}</span>
            </div>
            <div className="info-item">
              <label>เลขที่ใบประกอบวิชาชีพ:</label>
              <span>{student.license_number}</span>
            </div>
            <div className="info-item">
              <label>ที่อยู่ที่ทำงาน:</label>
              <span>{student.work_addr}</span>
            </div>
            <div className="info-item">
              <label>ตำแหน่งงาน:</label>
              <span>{student.work_position}</span>
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
              <label>คำนำหน้า:</label>
              <select
                value={formData.prefix || ''}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>
            <div className="form-group">
              <label>ชื่อ:</label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>นามสกุล:</label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                value={formData.tel || ''}
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>อีเมลส่วนตัว:</label>
              <input
                type="email"
                value={formData.personal_email || ''}
                onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>อีเมล RSU:</label>
              <input
                type="email"
                value={formData.rsu_email || ''}
                onChange={(e) => setFormData({ ...formData, rsu_email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ที่อยู่ที่ทำงาน:</label>
              <textarea
                value={formData.work_addr || ''}
                onChange={(e) => setFormData({ ...formData, work_addr: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ตำแหน่งงาน:</label>
              <input
                type="text"
                value={formData.work_position || ''}
                onChange={(e) => setFormData({ ...formData, work_position: e.target.value })}
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
              <label>อาจารย์ที่ปรึกษาร่วม:</label>
              <input
                type="text"
                value={formData.co_advisor || ''}
                onChange={(e) => setFormData({ ...formData, co_advisor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>สถานะ:</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ปกติ">ปกติ</option>
                <option value="พักการศึกษา">พักการศึกษา</option>
                <option value="จบการศึกษา">จบการศึกษา</option>
                <option value="ลาออก">ลาออก</option>
              </select>
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
