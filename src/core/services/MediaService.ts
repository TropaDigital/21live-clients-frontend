import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const MediaService = {
  get: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string,
    deleted?: boolean
  ) => {
    const tenant = getSlug();

    const queryDeleted = deleted ? `&deleted=true` : ``;
    const queryOrder = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/Medias?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Medias/${id}`);
    return response.data;
  },
  set: async ({
    id,
    tenant_id,
    media_cat_id,
    name,
    measure,
    sizeable,
    value,
  }: {
    id?: number | null;
    tenant_id: number;
    media_cat_id: number;
    name: string;
    measure: string;
    sizeable: boolean;
    value: number;
  }) => {
    const tenant = getSlug();
    const payload = {
      tenant_id,
      media_cat_id,
      name,
      measure,
      sizeable,
      value,
    };
    let response;
    if (id) {
      response = await BaseService.put(`/${tenant}/API/Medias/${id}`, payload);
    } else {
      response = await BaseService.post(`/${tenant}/API/Medias`, payload);
    }
    return response.data;
  },
  delete: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/Medias/${id}`);
    return response.data;
  },

  getCats: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string,
    deleted?: boolean
  ) => {
    const tenant = getSlug();

    const queryDeleted = deleted ? `&deleted=true` : ``;
    const queryOrder = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/MediaCats?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getCatById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/MediaCats/${id}`);
    return response.data;
  },
  setCat: async ({
    id,
    tenant_id,
    title,
  }: {
    id?: number | null;
    tenant_id: number;
    title: string;
  }) => {
    const tenant = getSlug();
    const payload = {
      tenant_id,
      title,
    };
    let response;
    if (id) {
      response = await BaseService.put(
        `/${tenant}/API/MediaCats/${id}`,
        payload
      );
    } else {
      response = await BaseService.post(`/${tenant}/API/MediaCats`, payload);
    }
    return response.data;
  },
  deleteCat: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/MediaCats/${id}`);
    return response.data;
  },
};
