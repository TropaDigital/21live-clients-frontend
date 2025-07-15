import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const DashboardService = {
  getInfo: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Dashboard/info`);
    return response.data;
  },
  getBanners: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Dashboard/banners`);
    return response.data;
  },
  getPosts: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Dashboard/posts`);
    return response.data;
  },
  getRecents: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Dashboard/recent`);
    return response.data;
  },
  getGraphs: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Dashboard/graphs`);
    return response.data;
  },
};
