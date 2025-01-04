import axios from 'axios';

const apiUrl = 'http://localhost:3001/api/empresas';

export const getEmpresa = async () => {
  return axios.get(apiUrl);
};

export const createEmpresa = async (data: any) => {
  return axios.post(apiUrl, data);
};

export const updateEmpresa = async (id: number, data: any) => {
  return axios.put(`${apiUrl}/${id}`, data);
};

export const deleteEmpresa = async (id: number) => {
  return axios.delete(`${apiUrl}/${id}`);
};
