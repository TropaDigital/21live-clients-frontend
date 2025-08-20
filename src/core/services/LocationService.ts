import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const LocationService = {
  getCountries: async (page: number, limit: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Countries?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getStates: async (page: number, limit: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/States?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getCities: async (page: number, limit: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Cities?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
