import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auth = {
  login: (email, senha) => axios.post(`${API_URL}/auth/login`, { email, senha }),
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  getMe: () => axios.get(`${API_URL}/users/me`, { headers: getAuthHeader() })
};

export const partidas = {
  getAll: () => axios.get(`${API_URL}/partidas`),
  create: (data) => axios.post(`${API_URL}/partidas`, data, { headers: getAuthHeader() })
};

export const users = {
  getAll: () => axios.get(`${API_URL}/users`)
};

export const quadras = {
  getAll: () => axios.get(`${API_URL}/quadras`),
  getAllAdmin: () => axios.get(`${API_URL}/quadras/all`, { headers: getAuthHeader() }),
  create: (data) => axios.post(`${API_URL}/quadras`, data, { headers: getAuthHeader() }),
  updateStatus: (id, status) => axios.patch(`${API_URL}/quadras/${id}/status`, { status }, { headers: getAuthHeader() })
};

export const campeonatos = {
  getAll: () => axios.get(`${API_URL}/campeonatos`),
  inscrever: (id, nome_time) => axios.post(`${API_URL}/campeonatos/${id}/inscrever`, { nome_time }, { headers: getAuthHeader() })
};

export const stats = {
  getDashboard: () => axios.get(`${API_URL}/stats/dashboard`)
};

export default {
  auth,
  partidas,
  users,
  quadras,
  campeonatos,
  stats
};
