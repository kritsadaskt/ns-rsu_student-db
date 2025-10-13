import { useState, useEffect } from 'react';
import { getStatistics, getStudents } from '../api/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await getStatistics();
      const studentsRes = await getStudents();
      setStats(statsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!stats) return <div>กำลังโหลด...</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard - สรุปข้อมูลนักศึกษา</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>จำนวนนักศึกษาทั้งหมด</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>

        <div className="stat-card">
          <h3>อายุเฉลี่ย</h3>
          <div className="stat-value">{stats.avgAge?.toFixed(1)} ปี</div>
        </div>
      </div>

      <div className="advisor-section">
        <h3>จำนวนนักศึกษาแต่ละอาจารย์ที่ปรึกษา</h3>
        <table>
          <thead>
            <tr>
              <th>อาจารย์ที่ปรึกษา</th>
              <th>จำนวนนักศึกษา</th>
            </tr>
          </thead>
          <tbody>
            {stats.advisors?.map((advisor, idx) => (
              <tr key={idx}>
                <td>{advisor.main_advisor || 'ไม่ระบุ'}</td>
                <td>{advisor.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="recent-students">
        <h3>นักศึกษาล่าสุด</h3>
        <table>
          <thead>
            <tr>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อ-สกุล</th>
              <th>อายุ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.full_name}</td>
                <td>{student.age}</td>
                <td>{student.status || 'ไม่ระบุ'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
