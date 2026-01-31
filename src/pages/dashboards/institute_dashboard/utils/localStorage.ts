import { InstituteDetails } from '../types/institute';

export const saveInstituteData = (data: any) => {
  try {
    localStorage.setItem('institute_data', JSON.stringify(data));
    localStorage.setItem('institute_auth', 'true');
    localStorage.setItem('institute_email', data.basicInfo.email);
    localStorage.setItem('institute_id', data.id);
    return true;
  } catch (error) {
    console.error('Error saving institute data:', error);
    return false;
  }
};

export const getInstituteData = () => {
  try {
    const data = localStorage.getItem('institute_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting institute data:', error);
    return null;
  }
};

export const updateInstituteData = (data: Partial<InstituteDetails>) => {
  try {
    const currentData = getInstituteData();
    if (currentData) {
      const updatedData = { ...currentData, ...data, updatedAt: new Date().toISOString() };
      saveInstituteData(updatedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating institute data:', error);
    return false;
  }
}; 