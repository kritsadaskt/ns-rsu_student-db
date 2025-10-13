import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Students
export const getStudents = () => axios.get(`${API_URL}/students`);
export const getStudent = (id) => axios.get(`${API_URL}/students/${id}`);
export const createStudent = (data) => axios.post(`${API_URL}/students`, data);
export const updateStudent = (id, data) => axios.put(`${API_URL}/students/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API_URL}/students/${id}`);

// Courses
export const getStudentCourses = (studentId) => axios.get(`${API_URL}/students/${studentId}/courses`);
export const createCourse = (data) => axios.post(`${API_URL}/courses`, data);
export const updateCourse = (id, data) => axios.put(`${API_URL}/courses/${id}`, data);
export const deleteCourse = (id) => axios.delete(`${API_URL}/courses/${id}`);

// Thesis Progress
export const updateThesisProgress = (studentId, data) => axios.put(`${API_URL}/thesis/${studentId}`, data);

// Statistics
export const getStatistics = () => axios.get(`${API_URL}/statistics`);
