import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const OrganizationService = {
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
      `/${tenant}/API/Organizations?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Organizations/${id}`
    );
    return response.data;
  },
  getGroupsOrgById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Organizations/${id}/groups`
    );
    return response.data;
  },
  set: async (params: any, options: any = {}) => {
    const {
      organization_id,
      tenant_id,
      logo,
      logo_b,
      logo_w,
      country_id,
      city_id,
      name,
      address,
      email,
      cnpj,
      phone,
      whatsapp,
      facebook,
      instagram,
      website,
      social_footer,
      workhours,
    } = params;

    const tenant = getSlug();
    const formData = new FormData();

    formData.append("tenant_id", String(tenant_id));

    if (logo) formData.append("logo", logo);
    if (logo_w) formData.append("logo_w", logo_w);
    if (logo_b) formData.append("logo_b", logo_b);
    if (organization_id) formData.append("organization_id", organization_id);
    if (name) formData.append("name", name);
    if (email) formData.append("email", email);
    if (whatsapp) formData.append("whatsapp", whatsapp);
    if (country_id) formData.append("country_id", country_id);
    if (city_id) formData.append("city_id", city_id);
    if (address) formData.append("address", address);
    if (cnpj) formData.append("cnpj", cnpj);
    if (phone) formData.append("phone", phone);
    if (facebook) formData.append("facebook", facebook);
    if (instagram) formData.append("instagram", instagram);
    if (website) formData.append("website", website);
    if (social_footer) formData.append("social_footer", social_footer);
    if (workhours || workhours === 0) formData.append("workhours", workhours);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      ...options, // permite onUploadProgress ou outros headers
    };

    let response;

    if (organization_id) {
      response = await BaseService.put(
        `/${tenant}/API/Organizations/${organization_id}`,
        formData,
        config
      );
    } else {
      response = await BaseService.post(
        `/${tenant}/API/Organizations`,
        formData,
        config
      );
    }

    return response.data;
  },
  setOrganizationGroups: async ({
    id,
    groups,
  }: {
    id: number | null;
    groups: number[];
  }) => {
    const tenant = getSlug();

    const payload = { groups };

    const response = await BaseService.put(
      `/${tenant}/API/Organizations/${id}/groups`,
      payload
    );

    return response.data;
  },
  delete: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(
      `/${tenant}/API/Organizations/${id}`
    );
    return response.data;
  },

  getGroup: async (
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
      `/${tenant}/API/OrgGroups?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );
    return response.data;
  },
  getGroupById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/OrgGroups/${id}`);
    return response.data;
  },
  deleteGroup: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/OrgGroups/${id}`);
    return response.data;
  },
  setGroup: async ({
    id,
    tenant_id,
    title,
    description,
    organizations,
  }: {
    id: number | null;
    tenant_id: number;
    title: string;
    description?: string;
    organizations: number[];
  }) => {
    const tenant = getSlug();

    const payload = { tenant_id, title, description, organizations };
    let response;
    if (id) {
      response = await BaseService.put(
        `/${tenant}/API/OrgGroups/${id}`,
        payload
      );
    } else {
      response = await BaseService.post(`/${tenant}/API/OrgGroups`, payload);
    }
    return response.data;
  },
};
