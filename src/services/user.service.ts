import axios from "axios";
import authAxios, { API_Url, GeneralApiResponse } from "./url.service";
import { useMutation, useQuery } from "@tanstack/react-query";
const prefix = "/users";

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser extends ILogin {
  _id?: string;
  name: string;
  pic?: string | File | null;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserApiHook = () => {
  const register = async (data: FormData) => {
    return axios.post<GeneralApiResponse>(`${API_Url}${prefix}/`, data);
  };
  const login = async (data: ILogin) => {
    return axios.post<GeneralApiResponse<{ user: IUser; token: string }>>(
      `${API_Url}${prefix}/login`,
      data
    );
  };

  const forgetPassword = async (data: ILogin) => {
    return axios.patch<GeneralApiResponse>(
      `${API_Url}${prefix}/forget-password`,
      data
    );
  };

  const getCurrentUser = async () => {
    return authAxios.get<GeneralApiResponse<IUser>>(`${prefix}/getCurrentUser`);
  };
  const getByName = async (name: string) => {
    return authAxios.get<GeneralApiResponse<IUser[]>>(
      `${prefix}/getByName/${name}`
    );
  };
  const getById = async (id: string) => {
    return authAxios.get<GeneralApiResponse<IUser>>(`${prefix}/${id}`);
  };

  return {
    register,
    login,
    getCurrentUser,
    getByName,
    getById,
    forgetPassword,
  };
};

export const useRegisterUser = () => {
  const api = UserApiHook();
  return useMutation({
    mutationFn: api.register,
  });
};

export const useLoginUser = () => {
  const api = UserApiHook();
  return useMutation({
    mutationFn: api.login,
  });
};
export const useForgetPassword = () => {
  const api = UserApiHook();
  return useMutation({
    mutationFn: api.forgetPassword,
  });
};

export const useGetCurrentUser = () => {
  const api = UserApiHook();

  return useQuery({
    queryKey: ["get", "currentUser"],
    queryFn: () => api.getCurrentUser().then((res) => res.data.data),
    enabled: false,
  });
};

export const useGetByName = (name: string) => {
  const api = UserApiHook();

  return useQuery({
    queryKey: ["get", "search user", name],
    queryFn: () => api.getByName(name).then((res) => res.data.data),
    enabled: !!name,
  });
};

export const useGetById = (id: string) => {
  const api = UserApiHook();

  return useQuery({
    queryKey: ["get", "user by id", id],
    queryFn: () => api.getById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};
