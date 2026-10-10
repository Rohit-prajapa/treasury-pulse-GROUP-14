import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
});

export const getCashPositions = (params = {}) => api.get("/cash-positions", { params });
export const getForecast = (params = {}) => api.get("/forecast", { params });
export const getAlerts = (params = {}) => api.get("/alerts", { params });

export const uploadTransactions = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/transactions/upload", formData);
};

export default api;