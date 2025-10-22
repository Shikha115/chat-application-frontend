export const Base_Url = `${process.env.NEXT_PUBLIC_API_URL}`;
export const API_Url = `${Base_Url}/api`;
import axios from "axios";

export interface GeneralApiResponse<T = unknown> {
  success?: boolean;
  message: string;
  data?: T;
}

export const generateFilePath = (img: File) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`;
};

const authAxios = axios.create({
  baseURL: API_Url, 
});


authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authAxios;