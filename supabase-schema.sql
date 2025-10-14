-- ============================================
-- Graduate Student Database Schema for Supabase
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Drop existing tables (if they exist)
-- ============================================
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS thesis_progress CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- ============================================
-- Create students table
-- ============================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Create thesis_progress table
-- ============================================
CREATE TABLE thesis_progress (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES students(student_id) ON DELETE CASCADE,
    proposal_exam_date TEXT,
    proposal_status TEXT,
    defense_exam_date TEXT,
    defense_status TEXT,
    publication_status TEXT,
    graduation_notice TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- ============================================
-- Create course_enrollments table
-- ============================================
CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    student_id TEXT REFERENCES students(student_id) ON DELETE CASCADE,
    course_code TEXT,
    course_name TEXT,
    grade TEXT,
    semester TEXT,
    year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Create indexes for better query performance
-- ============================================
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_main_advisor ON students(main_advisor);
CREATE INDEX idx_thesis_student_id ON thesis_progress(student_id);
CREATE INDEX idx_courses_student_id ON course_enrollments(student_id);

-- ============================================
-- Create updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Create triggers for updated_at
-- ============================================
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thesis_progress_updated_at
    BEFORE UPDATE ON thesis_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Insert sample data
-- ============================================
INSERT INTO students (
    student_id, full_name, birth_date, age, national_id, id_card_address,
    current_address, phone, email, undergraduate_from, undergraduate_gpa,
    professional_license, current_workplace, status, main_advisor, co_advisor
) VALUES 
(
    '6304017',
    'นางดลยา สุภีแดน',
    '27 มิ.ย.2522',
    41,
    '3301700286678',
    '17/63 ต.ท่าวาสุกรี อ.เมือง จ.อยุธยา',
    '34/2 ต.ปากกราน อ.เมือง จ.อยุธยา 13000',
    '098-265-5337',
    'ultragirl27@hotmail.com',
    'วพ.ชัยนาท',
    2.88,
    '4511166511',
    'รพ.มหาวชิราลงกรณธัญบุรี',
    'ปกติ',
    'ผศ.ดร.ขนิตฐา',
    'ผศ.ดร.รัชนี'
),
(
    '6304103',
    'น.ส.สุภัสรา',
    '13 เม.ย.2538',
    25,
    '1450300000000',
    '2/1 ถ.พญาไท แขวงทุ่งพญาไท',
    '60/284 ถ.สุขุมวิท',
    '088-778-7028',
    'looknamsp@gmail.com',
    'วพ.กรุงเทพ',
    3.12,
    '6011279597',
    'รพ.สมุทราปราการ',
    'ปกติ',
    'ผศ.ดร.ขนิตฐา',
    NULL
),
(
    '6304679',
    'นายพีรเดช',
    '25 ก.ย.2522',
    41,
    '3149901000000',
    '333/60 หมู่ 1 ต.หัวรอ',
    '333/60 หมู่ 1 ต.หัวรอ',
    '086-701-9944',
    'ppheeraya@gmail.com',
    'ม.มหิดล',
    2.77,
    '4511151671',
    'รพ.อยุธยา',
    'ปกติ',
    'ผศ.ดร.ขนิตฐา',
    NULL
),
(
    '6305076',
    'น.ส.กาญจนวดี',
    '8 ก.ย.2536',
    27,
    '1103701000000',
    '45/42 หมู่ 9 ต.บางพูด',
    '45/42 หมู่ 9 ต.บางพูด',
    '085-055-7237',
    'Kanjanawadee_p@gmail.com',
    'วพ.นนทบุรี',
    2.87,
    '5911265637',
    'สถาบันโรคทรวงอก',
    'ปกติ',
    'หาญประสิทธิ์คำ',
    NULL
),
(
    '6305077',
    'น.ส.ไปรยา',
    '23 ต.ค.2534',
    29,
    '1100501000000',
    '118 หมู่ 2 ต.ตาคลี',
    '99/82-83 ซ.2 ถ.เฉลิม',
    '082-576-0904',
    'pk.indy999@gmail.com',
    'วพ.สถาบันสมทบ',
    3.11,
    '5711249668',
    'รพ.ธรรมศาสตร์เฉลิมพระเกียรติ',
    'ปกติ',
    'ผศ.ดร.วารินทร์',
    NULL
);

-- Insert thesis progress records
INSERT INTO thesis_progress (
    student_id, proposal_exam_date, proposal_status, defense_exam_date, defense_status
) VALUES 
('6304017', '29 พ.ค.65', 'ผ่าน', NULL, NULL),
('6304103', '18 มิ.ย.65', 'ผ่าน', NULL, NULL),
('6304679', '18 มิ.ย.65', 'ผ่าน', NULL, NULL);

-- Insert course enrollments
INSERT INTO course_enrollments (
    student_id, course_code, course_name, grade, semester, year
) VALUES 
('6304017', 'MAT604', 'Statistics', 'A', 'ภาค 1', '2563'),
('6304017', 'MNS623', 'Adult and Gerontological Nursing', 'A', 'ภาค 1', '2563'),
('6304017', 'MNS624', 'Adult and Gerontological Nursing Practicum I', 'A', 'ภาค 1', '2563'),
('6304103', 'MNS601', 'Health System, Policy and Nursing', 'A', 'ภาค 1', '2563'),
('6304103', 'MNS612', 'Clinical Pathophysiology', 'A', 'ภาค 1', '2563'),
('6304679', 'MNS613', 'Clinical Pharmacology', 'A', 'ภาค 2', '2563'),
('6304679', 'MNS604', 'Concepts and Theories in Nursing', 'A', 'ภาค 2', '2563');

-- ============================================
-- Enable Row Level Security (RLS) - Optional
-- ============================================
-- Uncomment if you want to enable RLS for security

-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE thesis_progress ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust based on your needs)
-- CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for authenticated users" ON students FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for authenticated users" ON students FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for authenticated users" ON students FOR DELETE USING (true);

