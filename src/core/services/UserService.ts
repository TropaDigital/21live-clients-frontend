import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const UserService = {
  login: async (
    tenant: string,
    username: string,
    password: string,
    remember: boolean
  ) => {
    const response = await BaseService.post(`/${tenant}/API/Auth/login`, {
      username,
      password,
      persistent: remember,
    });
    return response.data;
  },
  get: async (
    page: number,
    limit: number,
    search?: string,
    order?: string,
    deleted?: boolean
  ) => {
    const tenant = getSlug();

    const queryDeleted = deleted ? `&deleted=true` : ``;
    const querySort = order ? `&sort=${order}` : ``;
    const querySearch = search ? `&search=${search}` : ``;

    const response = await BaseService.get(
      `/${tenant}/API/Users?page=${page}&limit=${limit}${querySearch}${querySort}${queryDeleted}`
    );
    return response.data;
  },
  getUsername: async (username: string) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Users/usernameCheck/${username}`
    );
    return response.data;
  },
  getById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Users/${id}`);
    return response.data;
  },
  getByIdOrganizations: async (id: number, tenant_user?: string) => {
    const tenant = tenant_user ? tenant_user : getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Users/${id}/organizations`
    );
    return response.data;
  },
  setByIdOrganizations: async (id: number, organizations: number[]) => {
    const tenant = getSlug();
    const response = await BaseService.put(
      `/${tenant}/API/Users/${id}/organizations`,
      {
        organizations,
      }
    );
    return response.data;
  },
  getByIdTenants: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Users/${id}/tenants`
    );
    return response.data;
  },
  setByIdTenants: async (id: number, tenants: number[]) => {
    const tenant = getSlug();
    const response = await BaseService.put(
      `/${tenant}/API/Users/${id}/tenants`,
      {
        tenants,
      }
    );
    return response.data;
  },
  profile: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Users/me`);
    return response.data;
  },
  refreshToken: async (tenant: string) => {
    const response = await BaseService.post(`/${tenant}/API/Auth/refresh`);
    return response.data;
  },
  set: async (params: any, options: any = {}) => {
    const {
      user_id,
      organization_id,
      tenant_id,
      username,
      name,
      email,
      email2,
      whats_country_id,
      whatsapp,
      downlimit,
      need_fill,
      askpswd,
      avatar,
      password,
      role_id,
    } = params;

    const tenant = getSlug();
    const formData = new FormData();

    formData.append("tenant_id", String(tenant_id));

    if (organization_id) formData.append("organization_id", organization_id);
    if (name) formData.append("name", name);
    if (username) formData.append("username", username);
    if (password) formData.append("password", password);
    if (email) formData.append("email", email);
    if (email2) formData.append("email2", email2);
    if (whats_country_id) formData.append("whats_country_id", whats_country_id);
    if (whatsapp) formData.append("whatsapp", whatsapp);
    if (downlimit) formData.append("downlimit", downlimit);
    if (need_fill) formData.append("need_fill", need_fill);
    if (askpswd === true || askpswd === false)
      formData.append("askpswd", askpswd);
    if (avatar) formData.append("avatar", avatar);
    if (user_id) formData.append("user_id", user_id);
    if (role_id) formData.append("role_id", role_id);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      ...options, // permite onUploadProgress ou outros headers
    };

    let response;

    if (user_id) {
      response = await BaseService.put(
        `/${tenant}/API/Users/${user_id}`,
        formData,
        config
      );
    } else {
      response = await BaseService.post(
        `/${tenant}/API/Users`,
        formData,
        config
      );
    }

    return response.data;
  },
  delete: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/Users/${id}`);
    return response.data;
  },
};
