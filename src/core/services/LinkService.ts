import type { IFolderLink } from "../types/iFolder";
import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const LinkService = {
  get: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/links/${id}`);
    return response.data;
  },
  set: async ({
    link_id,
    tenant_id,
    folder_id,
    name,
    type,
    target_type,
    target_id,
    icon,
    url,
  }: IFolderLink) => {
    const tenant = getSlug();

    let response;

    if (link_id) {
      response = await BaseService.put(`/${tenant}/API/links/${link_id}`, {
        tenant_id,
        folder_id,
        name,
        type,
        target_type,
        target_id,
        icon,
        url,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/links`, {
        tenant_id,
        folder_id,
        name,
        type,
        target_type,
        target_id,
        icon,
        url,
      });
    }

    return response.data;
  },
  delete: async ({ id }: { id: number }) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/links/${id}`);
    return response.data;
  },
};
