import api from './api';

export const erpService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    // In a real app, this might be a single aggregate endpoint
    // For now, we'll fetch from multiple endpoints if needed or mock the aggregation
    const [classes, students, events] = await Promise.all([
      api.get('/classes'),
      api.get('/users?role=student'), // Assuming backend supports role filtering or we filter frontend
      api.get('/events')
    ]);
    
    return {
      totalClasses: classes.data.data?.length || 0,
      totalStudents: students.data.data?.length || 0,
      upcomingEvents: events.data.data?.length || 0
    };
  },

  // Users & Roles
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  getUsers: async (search?: string) => {
    const response = await api.get('/users', { params: { search } });
    return response.data;
  },

  updateUser: async (userId: string, data: any) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Students
  getStudents: async (search?: string) => {
    const response = await api.get('/users', { params: { role: 'student', search } });
    return response.data;
  },

  getTeachers: async (search?: string) => {
    const response = await api.get('/users', { params: { role: 'teacher', search } });
    return response.data;
  },

  getStudentDetails: async (studentId: string) => {
    const response = await api.get(`/users/${studentId}`);
    return response.data;
  },

  // Attendance
  getAttendanceByClass: async (classId: string) => {
    const response = await api.get(`/attendance/class/${classId}`);
    return response.data;
  },

  markAttendance: async (data: { student_id: string; class_id: string; date: string; status: string }) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  // Fees
  getFees: async () => {
    const response = await api.get('/fees');
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Classes
  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getClassDetails: async (classId: string) => {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  },

  updateClass: async (classId: string, data: any) => {
    const response = await api.put(`/classes/${classId}`, data);
    return response.data;
  },

  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },

  getStudentInvoices: async (studentId: string) => {
    const response = await api.get(`/invoices?student_id=${studentId}`);
    return response.data;
  },

  downloadInvoice: async (invoiceId: string) => {
    // Mocking download functionality
    console.log(`Downloading invoice ${invoiceId}...`);
    return true;
  },

  // Report Cards
  getReportCards: async () => {
    const response = await api.get('/report-cards');
    return response.data;
  },

  createReportCard: async (data: any) => {
    const response = await api.post('/report-cards', data);
    return response.data;
  },

  getStudentReportCards: async (studentId: string) => {
    const response = await api.get(`/students/${studentId}/report-cards`);
    return response.data;
  },

  // Events
  createEvent: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (eventId: string, eventData: any) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  rsvpToEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/rsvp`);
    return response.data;
  },

  // Payments & Fees
  recordPayment: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  createFeeStructure: async (feeData: any) => {
    const response = await api.post('/fees', feeData);
    return response.data;
  },

  // Complaints
  fileComplaint: async (complaintData: any) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  // Leaves
  applyLeave: async (leaveData: any) => {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  },

  // Classes & Subjects
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  mapSubjectToClass: async (data: { class_id: string; subject_id: string; teacher_id?: string }) => {
    const response = await api.post('/classroom-subjects', data);
    return response.data;
  },

  createClass: async (classData: any) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  createSubject: async (subjectData: any) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  assignStudentToClass: async (classId: string, studentIds: string | string[]) => {
    const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
    const response = await api.post(`/classes/${classId}/students`, { student_ids: ids });
    return response.data;
  },

  assignTeachersToClass: async (classId: string, teacherIds: string | string[]) => {
    const ids = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
    const response = await api.post(`/classes/${classId}/teachers`, { teacher_ids: ids });
    return response.data;
  },

  deleteClass: async (classId: string) => {
    const response = await api.delete(`/classes/${classId}`);
    return response.data;
  }
};
