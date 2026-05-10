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
  submitAdmission: async (data: AdmissionData) => {
    const response = await api.post('/admissions', data);
    return response.data;
  },
  
  getAdmissions: async () => {
    const response = await api.get('/admissions');
    return response.data;
  }
};
