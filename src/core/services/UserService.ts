import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const UserService = {
  login: async (tenant: string, username: string, password: string) => {
    const response = await BaseService.post(`/${tenant}/API/Auth/login`, {
      username,
      password,
    });
    return response.data;
  },
  get: async (page: number, limit: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Users?page=${page}&limit=${limit}`);
    return response.data;
  },
  profile: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Users/me`);
    return response.data;
  },
  refreshToken: async (tenant: string) => {
    const response = await BaseService.post(`/${tenant}/API/Auth/refresh`);
    return response.data;
  },
};
