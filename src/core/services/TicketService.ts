import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const TicketService = {
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
      `/${tenant}/API/TicketCats?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getCatById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/TicketCats/${id}`);
    return response.data;
  },
  setCat: async ({
    id,
    tenant_id,
    title,
    setas_default,
    use_title,
    allow_files,
    default_fields,
    default_media_id,
    jobs,
    materials,
    use_media,
    private_media,
  }: {
    id?: number | null;
    tenant_id: number;
    title: string;
    setas_default: boolean;
    use_title: boolean;
    default_fields: boolean;
    allow_files: boolean;
    use_media: boolean;
    default_media_id: number | null;
    private_media: boolean;
    jobs: boolean;
    materials?: "single";
  }) => {
    const tenant = getSlug();
    const payload = {
      tenant_id,
      title,
      setas_default,
      use_title,
      allow_files,
      default_fields,
      default_media_id,
      jobs,
      materials,
      use_media,
    };

    let response;
    if (id) {
      response = await BaseService.put(`/${tenant}/API/TicketCats/${id}`, {
        ...payload,
        private: private_media,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/TicketCats`, {
        ...payload,
        private: private_media,
      });
    }
    return response.data;
  },
  deleteCat: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(
      `/${tenant}/API/TicketCats/${id}`
    );
    return response.data;
  },

  getStatus: async (
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
      `/${tenant}/API/TicketStatus?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getStatusById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/TicketStatus/${id}`);
    return response.data;
  },
  setStatus: async ({
    id,
    tenant_id,
    name,
    color,
    type,
  }: {
    id?: number | null;
    tenant_id: number;
    name: string;
    color: string;
    type: string;
  }) => {
    const tenant = getSlug();
    const payload = {
      tenant_id,
      name,
      color,
      type,
    };

    let response;
    if (id) {
      response = await BaseService.put(`/${tenant}/API/TicketStatus/${id}`, {
        ...payload,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/TicketStatus`, {
        ...payload,
      });
    }
    return response.data;
  },
  deleteStatus: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(
      `/${tenant}/API/TicketStatus/${id}`
    );
    return response.data;
  },

  getFields: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string,
    deleted?: boolean,
    ticket_cat_id?: number
  ) => {
    const tenant = getSlug();

    const queryDeleted = deleted ? `&deleted=true` : ``;
    const queryOrder = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;

    const cat_id = ticket_cat_id ? `&ticket_cat_id=${ticket_cat_id}` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/TicketCatFields?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}${cat_id}`
    );
    return response.data;
  },
  getFieldsById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/TicketCatFields/${id}`
    );
    return response.data;
  },
  setField: async ({
    id,
    tenant_id,
    description,
    label,
    name,
    ordem,
    required,
    ticket_cat_id,
    type,
    options,
  }: {
    id?: number | null;
    ticket_cat_id: number;
    tenant_id: number;
    name: string;
    label: string;
    type: string;
    description: string;
    options?: string[];
    required: boolean;
    ordem: number;
  }) => {
    const tenant = getSlug();
    const payload = {
      tenant_id,
      description,
      label,
      name,
      ordem,
      required,
      ticket_cat_id,
      type,
      options,
    };

    let response;

    if (id) {
      response = await BaseService.put(`/${tenant}/API/TicketCatFields/${id}`, {
        ...payload,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/TicketCatFields`, {
        ...payload,
      });
    }
    return response.data;
  },
  deleteField: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(
      `/${tenant}/API/TicketCatFields/${id}`
    );
    return response.data;
  },
};
