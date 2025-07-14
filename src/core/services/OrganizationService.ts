import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const OrganizationService = {
  get: async (page: number, limit: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Organizations?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getGroup: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/OrgGroups`);
    return response.data;
  },
};
