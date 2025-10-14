import { supabase, handleSupabaseError } from '../lib/supabaseClient';

// ============================================
// STUDENTS API
// ============================================

/**
 * Get all students with their thesis progress
 */
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      thesis_progress (
        proposal_exam_date,
        proposal_status,
        defense_exam_date,
        defense_status,
        publication_status,
        graduation_notice
      )
    `)
    .order('student_id', { ascending: true });

  handleSupabaseError(error);

  // Flatten the thesis_progress data to match the original API structure
  const flattenedData = data?.map(student => ({
    ...student,
    proposal_exam_date: student.thesis_progress?.[0]?.proposal_exam_date || null,
    proposal_status: student.thesis_progress?.[0]?.proposal_status || null,
    defense_exam_date: student.thesis_progress?.[0]?.defense_exam_date || null,
    defense_status: student.thesis_progress?.[0]?.defense_status || null,
    publication_status: student.thesis_progress?.[0]?.publication_status || null,
    graduation_notice: student.thesis_progress?.[0]?.graduation_notice || null,
    thesis_progress: undefined, // Remove the nested object
  }));

  return { data: flattenedData };
};

/**
 * Get a single student by ID with thesis progress
 */
export const getStudent = async (id) => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      thesis_progress (
        proposal_exam_date,
        proposal_status,
        defense_exam_date,
        defense_status,
        publication_status,
        graduation_notice
      )
    `)
    .eq('student_id', id)
    .single();

  handleSupabaseError(error);

  // Flatten the thesis_progress data
  const flattenedData = {
    ...data,
    proposal_exam_date: data.thesis_progress?.[0]?.proposal_exam_date || null,
    proposal_status: data.thesis_progress?.[0]?.proposal_status || null,
    defense_exam_date: data.thesis_progress?.[0]?.defense_exam_date || null,
    defense_status: data.thesis_progress?.[0]?.defense_status || null,
    publication_status: data.thesis_progress?.[0]?.publication_status || null,
    graduation_notice: data.thesis_progress?.[0]?.graduation_notice || null,
    thesis_progress: undefined,
  };

  return { data: flattenedData };
};

/**
 * Create a new student
 */
export const createStudent = async (studentData) => {
  const { data, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
    .single();

  handleSupabaseError(error);

  return { data: { message: 'Student created', id: data.student_id } };
};

/**
 * Update a student
 */
export const updateStudent = async (id, studentData) => {
  const { error } = await supabase
    .from('students')
    .update(studentData)
    .eq('student_id', id);

  handleSupabaseError(error);

  return { data: { message: 'Student updated' } };
};

/**
 * Delete a student
 */
export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('student_id', id);

  handleSupabaseError(error);

  return { data: { message: 'Student deleted' } };
};

// ============================================
// COURSE ENROLLMENTS API
// ============================================

/**
 * Get all courses for a student
 */
export const getStudentCourses = async (studentId) => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('student_id', studentId)
    .order('course_code', { ascending: true });

  handleSupabaseError(error);

  return { data };
};

/**
 * Create a new course enrollment
 */
export const createCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .insert([courseData])
    .select()
    .single();

  handleSupabaseError(error);

  return { data: { message: 'Course enrollment created', id: data.id } };
};

/**
 * Update a course enrollment
 */
export const updateCourse = async (id, courseData) => {
  const { error } = await supabase
    .from('course_enrollments')
    .update(courseData)
    .eq('id', id);

  handleSupabaseError(error);

  return { data: { message: 'Course enrollment updated' } };
};

/**
 * Delete a course enrollment
 */
export const deleteCourse = async (id) => {
  const { error } = await supabase
    .from('course_enrollments')
    .delete()
    .eq('id', id);

  handleSupabaseError(error);

  return { data: { message: 'Course enrollment deleted' } };
};

// ============================================
// THESIS PROGRESS API
// ============================================

/**
 * Update or create thesis progress for a student
 */
export const updateThesisProgress = async (studentId, thesisData) => {
  // Check if thesis progress exists for this student
  const { data: existing } = await supabase
    .from('thesis_progress')
    .select('id')
    .eq('student_id', studentId)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('thesis_progress')
      .update(thesisData)
      .eq('student_id', studentId);

    handleSupabaseError(error);

    return { data: { message: 'Thesis progress updated' } };
  } else {
    // Create new record
    const { error } = await supabase
      .from('thesis_progress')
      .insert([{ ...thesisData, student_id: studentId }]);

    handleSupabaseError(error);

    return { data: { message: 'Thesis progress created' }, status: 201 };
  }
};

// ============================================
// STATISTICS API
// ============================================

/**
 * Get statistics about students
 */
export const getStatistics = async () => {
  // Get total students
  const { count: totalStudents, error: countError } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  handleSupabaseError(countError);

  // Get average age
  const { data: ageData, error: ageError } = await supabase
    .from('students')
    .select('age')
    .not('age', 'is', null);

  handleSupabaseError(ageError);

  const avgAge = ageData.length > 0
    ? ageData.reduce((sum, s) => sum + s.age, 0) / ageData.length
    : null;

  // Get students by advisor
  const { data: advisorData, error: advisorError } = await supabase
    .from('students')
    .select('main_advisor');

  handleSupabaseError(advisorError);

  const advisorCounts = {};
  advisorData.forEach(s => {
    const advisor = s.main_advisor || 'Unknown';
    advisorCounts[advisor] = (advisorCounts[advisor] || 0) + 1;
  });

  const advisors = Object.entries(advisorCounts).map(([main_advisor, count]) => ({
    main_advisor,
    count,
  }));

  // Get students by status
  const { data: statusData, error: statusError } = await supabase
    .from('students')
    .select('status');

  handleSupabaseError(statusError);

  const statusCounts = {};
  statusData.forEach(s => {
    const status = s.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statuses = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return {
    data: {
      totalStudents,
      avgAge,
      advisors,
      statuses,
    },
  };
};

