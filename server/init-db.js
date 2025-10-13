const Database = require('better-sqlite3');
const path = require('path');

// Create database file
const db = new Database(path.join(__dirname, 'graduate_students.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Creating database schema...');

// Drop existing tables
db.exec(`
  DROP TABLE IF EXISTS course_enrollments;
  DROP TABLE IF EXISTS thesis_progress;
  DROP TABLE IF EXISTS students;
`);

// Create students table
db.exec(`
  CREATE TABLE students (
    student_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    birth_date TEXT,
    age INTEGER,
    national_id TEXT,
    id_card_address TEXT,
    current_address TEXT,
    phone TEXT,
    email TEXT,
    undergraduate_from TEXT,
    undergraduate_gpa REAL,
    professional_license TEXT,
    current_workplace TEXT,
    status TEXT,
    main_advisor TEXT,
    co_advisor TEXT,
    approval_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create thesis_progress table
db.exec(`
  CREATE TABLE thesis_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    proposal_exam_date TEXT,
    proposal_status TEXT,
    defense_exam_date TEXT,
    defense_status TEXT,
    publication_status TEXT,
    graduation_notice TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
  );
`);

// Create course_enrollments table
db.exec(`
  CREATE TABLE course_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    course_code TEXT,
    course_name TEXT,
    grade TEXT,
    semester TEXT,
    year TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
  );
`);

console.log('Database schema created successfully!');

// Insert sample data from Excel
console.log('Inserting sample data...');

const students = [
  {
    student_id: '6304017',
    full_name: 'นางดลยา สุภีแดน',
    birth_date: '27 มิ.ย.2522',
    age: 41,
    national_id: '3301700286678',
    id_card_address: '17/63 ต.ท่าวาสุกรี อ.เมือง จ.อยุธยา',
    current_address: '34/2 ต.ปากกราน อ.เมือง จ.อยุธยา 13000',
    phone: '098-265-5337',
    email: 'ultragirl27@hotmail.com',
    undergraduate_from: 'วพ.ชัยนาท',
    undergraduate_gpa: 2.88,
    professional_license: '4511166511',
    current_workplace: 'รพ.มหาวชิราลงกรณธัญบุรี',
    status: 'ปกติ',
    main_advisor: 'ผศ.ดร.ขนิตฐา',
    co_advisor: 'ผศ.ดร.รัชนี'
  },
  {
    student_id: '6304103',
    full_name: 'น.ส.สุภัสรา',
    birth_date: '13 เม.ย.2538',
    age: 25,
    national_id: '1450300000000',
    id_card_address: '2/1 ถ.พญาไท แขวงทุ่งพญาไท',
    current_address: '60/284 ถ.สุขุมวิท',
    phone: '088-778-7028',
    email: 'looknamsp@gmail.com',
    undergraduate_from: 'วพ.กรุงเทพ',
    undergraduate_gpa: 3.12,
    professional_license: '6011279597',
    current_workplace: 'รพ.สมุทราปราการ',
    status: 'ปกติ',
    main_advisor: 'ผศ.ดร.ขนิตฐา',
    co_advisor: null
  },
  {
    student_id: '6304679',
    full_name: 'นายพีรเดช',
    birth_date: '25 ก.ย.2522',
    age: 41,
    national_id: '3149901000000',
    id_card_address: '333/60 หมู่ 1 ต.หัวรอ',
    current_address: '333/60 หมู่ 1 ต.หัวรอ',
    phone: '086-701-9944',
    email: 'ppheeraya@gmail.com',
    undergraduate_from: 'ม.มหิดล',
    undergraduate_gpa: 2.77,
    professional_license: '4511151671',
    current_workplace: 'รพ.อยุธยา',
    status: 'ปกติ',
    main_advisor: 'ผศ.ดร.ขนิตฐา',
    co_advisor: null
  },
  {
    student_id: '6305076',
    full_name: 'น.ส.กาญจนวดี',
    birth_date: '8 ก.ย.2536',
    age: 27,
    national_id: '1103701000000',
    id_card_address: '45/42 หมู่ 9 ต.บางพูด',
    current_address: '45/42 หมู่ 9 ต.บางพูด',
    phone: '085-055-7237',
    email: 'Kanjanawadee_p@gmail.com',
    undergraduate_from: 'วพ.นนทบุรี',
    undergraduate_gpa: 2.87,
    professional_license: '5911265637',
    current_workplace: 'สถาบันโรคทรวงอก',
    status: 'ปกติ',
    main_advisor: 'หาญประสิทธิ์คำ',
    co_advisor: null
  },
  {
    student_id: '6305077',
    full_name: 'น.ส.ไปรยา',
    birth_date: '23 ต.ค.2534',
    age: 29,
    national_id: '1100501000000',
    id_card_address: '118 หมู่ 2 ต.ตาคลี',
    current_address: '99/82-83 ซ.2 ถ.เฉลิม',
    phone: '082-576-0904',
    email: 'pk.indy999@gmail.com',
    undergraduate_from: 'วพ.สถาบันสมทบ',
    undergraduate_gpa: 3.11,
    professional_license: '5711249668',
    current_workplace: 'รพ.ธรรมศาสตร์เฉลิมพระเกียรติ',
    status: 'ปกติ',
    main_advisor: 'ผศ.ดร.วารินทร์',
    co_advisor: null
  }
];

const insertStudent = db.prepare(`
  INSERT INTO students (
    student_id, full_name, birth_date, age, national_id, id_card_address,
    current_address, phone, email, undergraduate_from, undergraduate_gpa,
    professional_license, current_workplace, status, main_advisor, co_advisor
  ) VALUES (
    @student_id, @full_name, @birth_date, @age, @national_id, @id_card_address,
    @current_address, @phone, @email, @undergraduate_from, @undergraduate_gpa,
    @professional_license, @current_workplace, @status, @main_advisor, @co_advisor
  )
`);

const insertThesis = db.prepare(`
  INSERT INTO thesis_progress (
    student_id, proposal_exam_date, proposal_status, defense_exam_date, defense_status
  ) VALUES (?, ?, ?, ?, ?)
`);

const insertCourse = db.prepare(`
  INSERT INTO course_enrollments (
    student_id, course_code, course_name, grade, semester, year
  ) VALUES (?, ?, ?, ?, ?, ?)
`);

// Insert students
for (const student of students) {
  insertStudent.run(student);
}

// Insert thesis progress
insertThesis.run('6304017', '29 พ.ค.65', 'ผ่าน', null, null);
insertThesis.run('6304103', '18 มิ.ย.65', 'ผ่าน', null, null);
insertThesis.run('6304679', '18 มิ.ย.65', 'ผ่าน', null, null);

// Insert some course enrollments
const courses = [
  ['6304017', 'MAT604', 'Statistics', 'A', 'ภาค 1', '2563'],
  ['6304017', 'MNS623', 'Adult and Gerontological Nursing', 'A', 'ภาค 1', '2563'],
  ['6304017', 'MNS624', 'Adult and Gerontological Nursing Practicum I', 'A', 'ภาค 1', '2563'],
  ['6304103', 'MNS601', 'Health System, Policy and Nursing', 'A', 'ภาค 1', '2563'],
  ['6304103', 'MNS612', 'Clinical Pathophysiology', 'A', 'ภาค 1', '2563'],
  ['6304679', 'MNS613', 'Clinical Pharmacology', 'A', 'ภาค 2', '2563'],
  ['6304679', 'MNS604', 'Concepts and Theories in Nursing', 'A', 'ภาค 2', '2563']
];

for (const course of courses) {
  insertCourse.run(...course);
}

console.log('Sample data inserted successfully!');
console.log(`Total students: ${db.prepare('SELECT COUNT(*) as count FROM students').get().count}`);
console.log(`Total courses: ${db.prepare('SELECT COUNT(*) as count FROM course_enrollments').get().count}`);
console.log(`Total thesis records: ${db.prepare('SELECT COUNT(*) as count FROM thesis_progress').get().count}`);

db.close();
console.log('\nDatabase initialization complete!');
console.log('Database file: graduate_students.db');
