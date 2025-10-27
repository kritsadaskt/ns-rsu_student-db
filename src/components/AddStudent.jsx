import { useState } from 'react';
import { createStudent } from '../api/api';

function AddStudent({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    student_id: '',
    prefix: '',
    first_name: '',
    last_name: '',
    age: '',
    citizen_id: '',
    tel: '',
    personal_email: '',
    rsu_email: '',
    graduated_from: '',
    gpa: '',
    license_number: '',
    work_addr: '',
    work_position: '',
    status: 'ปกติ',
    main_advisor: '',
    co_advisor: '',
    published: '',
    complete_nofi: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      alert('เพิ่มนักศึกษาสำเร็จ');
      setFormData({
        student_id: '',
        prefix: '',
        first_name: '',
        last_name: '',
        age: '',
        citizen_id: '',
        tel: '',
        personal_email: '',
        rsu_email: '',
        graduated_from: '',
        gpa: '',
        license_number: '',
        work_addr: '',
        work_position: '',
        status: 'ปกติ',
        main_advisor: '',
        co_advisor: '',
        published: '',
        complete_nofi: ''
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating student:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มนักศึกษา');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>เพิ่มนักศึกษาใหม่</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

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
              <label>คำนำหน้า:</label>
              <select
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>

            <div className="form-group">
              <label>ชื่อ: *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>นามสกุล: *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
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
                name="citizen_id"
                value={formData.citizen_id}
                onChange={handleChange}
                maxLength="13"
              />
            </div>

            <div className="form-group">
              <label>เบอร์โทรศัพท์:</label>
              <input
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>อีเมลส่วนตัว:</label>
              <input
                type="email"
                name="personal_email"
                value={formData.personal_email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>อีเมล RSU:</label>
              <input
                type="email"
                name="rsu_email"
                value={formData.rsu_email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>จบการศึกษาจาก:</label>
              <input
                type="text"
                name="graduated_from"
                value={formData.graduated_from}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>GPA:</label>
              <input
                type="number"
                step="0.01"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                min="0"
                max="4"
              />
            </div>

            <div className="form-group">
              <label>เลขที่ใบประกอบวิชาชีพ:</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ที่อยู่ที่ทำงาน:</label>
              <textarea
                name="work_addr"
                value={formData.work_addr}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ตำแหน่งงาน:</label>
              <input
                type="text"
                name="work_position"
                value={formData.work_position}
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
              <label>การตีพิมพ์:</label>
              <input
                type="text"
                name="published"
                value={formData.published}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>การแจ้งจบการศึกษา:</label>
              <input
                type="text"
                name="complete_nofi"
                value={formData.complete_nofi}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">บันทึก</button>
            <button type="button" onClick={onClose} className="btn-cancel">
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
