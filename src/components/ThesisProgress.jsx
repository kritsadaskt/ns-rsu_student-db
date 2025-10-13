import { useState } from 'react';

function ThesisProgress({ student, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    proposal_exam_date: student.proposal_exam_date || '',
    proposal_status: student.proposal_status || '',
    defense_exam_date: student.defense_exam_date || '',
    defense_status: student.defense_status || '',
    publication_status: student.publication_status || '',
    graduation_notice: student.graduation_notice || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="thesis-progress">
      <h3>ความคืบหน้าวิทยานิพนธ์</h3>

      {!isEditing ? (
        <div className="progress-view">
          <div className="progress-grid">
            <div className="progress-item">
              <label>วันสอบโครงร่าง:</label>
              <span>{student.proposal_exam_date || 'ยังไม่กำหนด'}</span>
            </div>
            <div className="progress-item">
              <label>สถานะสอบโครงร่าง:</label>
              <span>{student.proposal_status || 'ยังไม่ระบุ'}</span>
            </div>
            <div className="progress-item">
              <label>วันสอบป้องกัน:</label>
              <span>{student.defense_exam_date || 'ยังไม่กำหนด'}</span>
            </div>
            <div className="progress-item">
              <label>สถานะสอบป้องกัน:</label>
              <span>{student.defense_status || 'ยังไม่ระบุ'}</span>
            </div>
            <div className="progress-item">
              <label>สถานะการตีพิมพ์:</label>
              <span>{student.publication_status || 'ยังไม่ระบุ'}</span>
            </div>
            <div className="progress-item">
              <label>แจ้งจบ:</label>
              <span>{student.graduation_notice || 'ยังไม่แจ้ง'}</span>
            </div>
          </div>

          <button onClick={() => setIsEditing(true)} className="btn-edit">
            แก้ไขความคืบหน้า
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="progress-form">
          <div className="form-grid">
            <div className="form-group">
              <label>วันสอบโครงร่าง:</label>
              <input
                type="text"
                value={formData.proposal_exam_date}
                onChange={(e) => setFormData({ ...formData, proposal_exam_date: e.target.value })}
                placeholder="เช่น 18 มิ.ย.65"
              />
            </div>
            <div className="form-group">
              <label>สถานะสอบโครงร่าง:</label>
              <select
                value={formData.proposal_status}
                onChange={(e) => setFormData({ ...formData, proposal_status: e.target.value })}
              >
                <option value="">เลือกสถานะ</option>
                <option value="ผ่าน">ผ่าน</option>
                <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                <option value="แก้ไข">แก้ไข</option>
              </select>
            </div>
            <div className="form-group">
              <label>วันสอบป้องกัน:</label>
              <input
                type="text"
                value={formData.defense_exam_date}
                onChange={(e) => setFormData({ ...formData, defense_exam_date: e.target.value })}
                placeholder="เช่น 20 ก.ค.65"
              />
            </div>
            <div className="form-group">
              <label>สถานะสอบป้องกัน:</label>
              <select
                value={formData.defense_status}
                onChange={(e) => setFormData({ ...formData, defense_status: e.target.value })}
              >
                <option value="">เลือกสถานะ</option>
                <option value="ผ่าน">ผ่าน</option>
                <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                <option value="แก้ไข">แก้ไข</option>
              </select>
            </div>
            <div className="form-group">
              <label>สถานะการตีพิมพ์:</label>
              <input
                type="text"
                value={formData.publication_status}
                onChange={(e) => setFormData({ ...formData, publication_status: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>แจ้งจบ:</label>
              <input
                type="text"
                value={formData.graduation_notice}
                onChange={(e) => setFormData({ ...formData, graduation_notice: e.target.value })}
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
    </div>
  );
}

export default ThesisProgress;
