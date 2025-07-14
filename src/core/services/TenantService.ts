import BaseService from "./BaseService";

export const TenantService = {
  getBySlug: async (slug: string) => {
    const response = await BaseService.get(`/dev/API/Tenants/bySlug/${slug}`);
    return response.data;
  },
  get: async () => {
    const response = await BaseService.get(`/dev/API/Tenants`);
    return response.data;
  },
};
