import moment from "moment";
import type { IFilterTicket } from "../../components/modules/cards/modal-filter-ticket";
import type { ITicketCat } from "../types/ITckets";
import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const TicketService = {
  get: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string,
    filter?: IFilterTicket
  ) => {
    const tenant = getSlug();

    const queryOrder = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;

    /*
    fromDate: Date | undefined;
    toDate: Date | undefined;
    organization_id: number | undefined;
    ticket_cat_id: number | undefined;
    ticket_status_id: number | undefined;
    user_id: number | undefined;
    */

    const queryFromDate = filter?.fromDate
      ? `&createdFrom=${moment(filter?.fromDate).format("YYYY-MM-DD")}`
      : ``;
    const queryToDate = filter?.toDate
      ? `&createdTo=${moment(filter?.toDate).format("YYYY-MM-DD")}`
      : ``;
    const queryOrganization = filter?.toDate
      ? `&organization_id=${filter.organization_id}`
      : ``;
    const queryCatId = filter?.ticket_cat_id
      ? `&ticket_cat_id=${filter.ticket_cat_id}`
      : ``;
    const queryStatusId = filter?.ticket_status_id
      ? `&ticket_status_id=${filter.ticket_status_id}`
      : ``;
    const queryUserId = filter?.user_id ? `&user_id=${filter.user_id}` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/Tickets?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryFromDate}${queryToDate}${queryOrganization}${queryCatId}${queryStatusId}${queryUserId}`
    );

    if (response.data.items && page) {
      response.data.items = response.data.items.map(
        (item: ITicketCat, index: number) => {
          const order = index + 1;
          return {
            ...item,
            ordem: page > 1 ? 10 * (page - 1) + order : order,
          };
        }
      );
    }

    return response.data;
  },
  delete: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/Tickets/${id}`);

    return response.data;
  },
  getById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Tickets/${id}`);

    return response.data;
  },
  getFiles: async (
    ticket_id: number,
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
      `/${tenant}/API/TicketFiles/${ticket_id}?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );

    return response.data;
  },
  getInteractions: async (
    ticket_id: number,
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
      `/${tenant}/API/TicketInteractions/${ticket_id}?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );

    return response.data;
  },
  setInteraction: async (params: any, options: any = {}) => {
    const {
      ticket_id,
      reply_id,
      user_id,
      custom_id,
      message,
      annex,
      annex_title,
      status,
      access,
      ticket_interaction_id,
    } = params;

    const tenant = getSlug();
    const formData = new FormData();

    formData.append("ticket_id", String(ticket_id));
    formData.append("user_id", String(user_id));
    formData.append("message", String(message));

    if (reply_id) formData.append("reply_id", reply_id);
    if (custom_id) formData.append("custom_id", custom_id);
    if (annex) formData.append("annex", annex);
    if (annex_title) formData.append("annex_title", annex_title);
    if (status) formData.append("status", status);
    if (access) formData.append("access", access);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      ...options, // permite onUploadProgress ou outros headers
    };

    let response;
    if (annex) {
      response = await BaseService.post(
        `/${tenant}/API/TicketInteractions/${
          ticket_interaction_id ? ticket_interaction_id : ticket_id
        }`,
        formData,
        config
      );
    } else {
      if (ticket_interaction_id) {
        response = await BaseService.put(
          `/${tenant}/API/TicketInteractions/${ticket_interaction_id}`,
          params
        );
      } else {
        response = await BaseService.post(
          `/${tenant}/API/TicketInteractions/${ticket_id}`,
          params
        );
      }
    }

    return response.data;
  },
  getCats: async (
    page?: number,
    limit?: number,
    search?: string,
    order?: string,
    deleted?: boolean,
    fields?: boolean
  ) => {
    const tenant = getSlug();

    const queryDeleted = deleted ? `&deleted=true` : ``;
    const queryOrder = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;
    const queryFields = fields ? `&fields=true` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/TicketCats?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}${queryFields}`
    );

    if (response.data.items && page) {
      response.data.items = response.data.items.map(
        (item: ITicketCat, index: number) => {
          const order = index + 1;
          return {
            ...item,
            ordem: page > 1 ? 10 * (page - 1) + order : order,
          };
        }
      );
    }

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
  duplicateCat: async (id: number, tenants: number[]) => {
    const tenant = getSlug();
    const response = await BaseService.post(
      `/${tenant}/API/TicketCats/export/${id}`,
      {
        tenants: tenants,
      }
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

  set: async (payload: any, id?: number) => {
    const tenant = getSlug();

    let response;
    if (id) {
      response = await BaseService.put(`/${tenant}/API/Tickets/${id}`, {
        ...payload,
      });
    } else {
      response = await BaseService.post(`/${tenant}/API/Tickets`, {
        ...payload,
      });
    }
    return response.data;
  },
  setFields: async (payload: any, ticket_id?: number, edit?: boolean) => {
    const tenant = getSlug();

    let response;
    if (edit) {
      response = await BaseService.put(
        `/${tenant}/API/Tickets/${ticket_id}/fields`,
        {
          ...payload,
        }
      );
    } else {
      response = await BaseService.post(
        `/${tenant}/API/Tickets/${ticket_id}/fields`,
        {
          ...payload,
        }
      );
    }
    return response.data;
  },
  setFiles: async (annex: File, ticket_id?: number) => {
    const tenant = getSlug();

    const formData = new FormData();

    formData.append("ticket_id", String(ticket_id));
    formData.append("path", annex);
    formData.append("name", annex.name);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const response = await BaseService.post(
      `/${tenant}/API/TicketFiles/${ticket_id}`,
      formData,
      config
    );

    return response.data;
  },
};
