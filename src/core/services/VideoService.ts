import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const VideoService = {
  get: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/videos/${id}`);
    return response.data;
  },
  set: async ({
    video_id,
    tenant_id,
    folder_id,
    name,
    host,
    code,
    tags,
  }: {
    video_id?: number;
    tenant_id: number;
    folder_id: number | null;
    name: string;
    host: string;
    code: string;
    tags: string;
  }) => {
    const tenant = getSlug();

    let response;

    if (video_id) {
      response = await BaseService.put(`/${tenant}/API/videos/${video_id}`, {
        tenant_id,
        folder_id,
        name,
        host,
        code,
        tags,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/videos`, {
        tenant_id,
        folder_id,
        name,
        host,
        code,
        tags,
      });
    }

    return response.data;
  },
  delete: async ({ id }: { id: number }) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/videos/${id}`);
    return response.data;
  },
};
