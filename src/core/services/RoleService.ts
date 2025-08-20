import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const RoleService = {
  get: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Roles`);
    return response.data;
  },
};
