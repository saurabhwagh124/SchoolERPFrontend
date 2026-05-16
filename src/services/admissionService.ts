import api from './api';

export interface AdmissionData {
  name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  address: string;
}

export const admissionService = {
  submitAdmission: async (data: any) => {
    // If data is not FormData, axios will handle it as JSON. 
    // If it is FormData, axios will set multipart/form-data.
    const response = await api.post('/admissions', data);
    return response.data;
  },
  
  getAdmissions: async () => {
    const response = await api.get('/admissions');
    return response.data;
  },

  updateAdmissionStatus: async (admissionId: string, status: string) => {
    const response = await api.patch(`/admissions/${admissionId}/status`, { status });
    return response.data;
  }
};
