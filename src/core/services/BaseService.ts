import axios from "axios";
import { STORAGE_TOKEN } from "../constants";

// Configuração de ambientes
const getBaseUrl = (): string => {
  switch (process.env.NODE_ENV) {
    case "development":
      return "https://dev.21live.com.br/";
    case "production":
      return "https://dev.21live.com.br/";
    case "staging":
      return "https://dev.21live.com.br/";
    default:
      return "https://dev.21live.com.br/";
  }
};

export const BASE_URL_API = getBaseUrl();

// Configuração global do Axios
const BaseService = axios.create({
  baseURL: BASE_URL_API,
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de requisição
BaseService.interceptors.request.use(
  (config) => {
    // Adicione tokens ou headers aqui
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
BaseService.interceptors.response.use(
  (response) => {
    // Você pode tratar respostas globais aqui
    return response; // Retorna apenas os dados da resposta
  },
  (error) => {
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Redirecionar para login se não autorizado
      //window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default BaseService;
