 
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const apiUrl = `${baseURL}/datasys`;

export const getDatasys = async () => {
  return axios.get(apiUrl);
};
export const createDatasys = async (data: any) => {
  return axios.post(apiUrl, data);
};
export const updateDatasys = async (id: number, data: any) => {
  return axios.put(`${apiUrl}/${id}`, data);
};
export const deleteDatasys = async (id: number) => {
  return axios.delete(`${apiUrl}/${id}`);
};
 
