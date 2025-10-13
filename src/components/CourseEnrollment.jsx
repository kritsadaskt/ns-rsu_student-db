import { useState } from 'react';
import { createCourse, deleteCourse } from '../api/api';

function CourseEnrollment({ studentId, courses, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    student_id: studentId,
    course_code: '',
    course_name: '',
    grade: '',
    semester: '',
    year: ''
  });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(newCourse);
      setNewCourse({
        student_id: studentId,
        course_code: '',
        course_name: '',
        grade: '',
        semester: '',
        year: ''
      });
      setShowAddForm(false);
      onUpdate();
      alert('เพิ่มรายวิชาสำเร็จ');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('ต้องการลบรายวิชานี้หรือไม่?')) {
      try {
        await deleteCourse(courseId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className="course-enrollment">
      <h3>รายวิชาที่ลงทะเบียน</h3>

      {courses.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>เกรด</th>
              <th>ภาคการศึกษา</th>
              <th>ปีการศึกษา</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.course_code}</td>
                <td>{course.course_name}</td>
                <td>{course.grade}</td>
                <td>{course.semester}</td>
                <td>{course.year}</td>
                <td>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="btn-delete"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ยังไม่มีรายวิชาที่ลงทะเบียน</p>
      )}

      {!showAddForm ? (
        <button onClick={() => setShowAddForm(true)} className="btn-add">
          + เพิ่มรายวิชา
        </button>
      ) : (
        <form onSubmit={handleAddCourse} className="add-course-form">
          <div className="form-grid">
            <div className="form-group">
              <label>รหัสวิชา:</label>
              <input
                type="text"
                value={newCourse.course_code}
                onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>ชื่อวิชา:</label>
              <input
                type="text"
                value={newCourse.course_name}
                onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>เกรด:</label>
              <input
                type="text"
                value={newCourse.grade}
                onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ภาคการศึกษา:</label>
              <input
                type="text"
                value={newCourse.semester}
                onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ปีการศึกษา:</label>
              <input
                type="text"
                value={newCourse.year}
                onChange={(e) => setNewCourse({ ...newCourse, year: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">บันทึก</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-cancel">
              ยกเลิก
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CourseEnrollment;
