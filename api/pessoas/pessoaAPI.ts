import axios from 'axios';

const apiUrl = 'http://localhost:3001/api/pessoas';

export const getPessoas = async () => {
  return axios.get(apiUrl);
};

export const createPessoas = async (data: any) => {
  return axios.post(apiUrl, data);
};

export const updatePessoas = async (id: number, data: any) => {
  return axios.put(`${apiUrl}/${id}`, data);
};

export const deletePessoas = async (id: number) => {
  return axios.delete(`${apiUrl}/${id}`);
};
