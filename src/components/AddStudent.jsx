import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../api/api';

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    birth_date: '',
    age: '',
    national_id: '',
    id_card_address: '',
    current_address: '',
    phone: '',
    email: '',
    undergraduate_from: '',
    undergraduate_gpa: '',
    professional_license: '',
    current_workplace: '',
    status: 'ปกติ',
    main_advisor: '',
    co_advisor: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      alert('เพิ่มนักศึกษาสำเร็จ');
      navigate('/students');
    } catch (error) {
      console.error('Error creating student:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มนักศึกษา');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-student">
      <h2>เพิ่มนักศึกษาใหม่</h2>

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-grid">
          <div className="form-group">
            <label>รหัสนักศึกษา: *</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ชื่อ-สกุล: *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>วันเกิด:</label>
            <input
              type="text"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              placeholder="เช่น 27 มิ.ย.2522"
            />
          </div>

          <div className="form-group">
            <label>อายุ:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>เลขบัตรประชาชน:</label>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ที่อยู่ตามบัตรประชาชน:</label>
            <textarea
              name="id_card_address"
              value={formData.id_card_address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ที่อยู่ปัจจุบัน:</label>
            <textarea
              name="current_address"
              value={formData.current_address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>อีเมล:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>จบการศึกษาจาก:</label>
            <input
              type="text"
              name="undergraduate_from"
              value={formData.undergraduate_from}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>GPA ป.ตรี:</label>
            <input
              type="number"
              step="0.01"
              name="undergraduate_gpa"
              value={formData.undergraduate_gpa}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>เลขที่ใบประกอบวิชาชีพ:</label>
            <input
              type="text"
              name="professional_license"
              value={formData.professional_license}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ที่ทำงานปัจจุบัน:</label>
            <input
              type="text"
              name="current_workplace"
              value={formData.current_workplace}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>อาจารย์ที่ปรึกษาหลัก:</label>
            <input
              type="text"
              name="main_advisor"
              value={formData.main_advisor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>อาจารย์ที่ปรึกษาร่วม:</label>
            <input
              type="text"
              name="co_advisor"
              value={formData.co_advisor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>สถานะ:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
          <button type="button" onClick={() => navigate('/students')} className="btn-cancel">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;
