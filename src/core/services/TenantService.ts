import type { ITenant } from "../types/iTenants";
import { getBaseUrl, getSlug } from "../utils/params-location";
import { getNameTypeTenant } from "../utils/replaces";
import BaseService from "./BaseService";

export const TenantService = {
  getBySlug: async (slug: string) => {
    const response = await BaseService.get(`/dev/API/Tenants/bySlug/${slug}`);
    return response.data;
  },
  getById: async (id: number) => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Tenants/${id}`);
    return response.data;
  },
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
      `/${tenant}/API/Tenants?page=${page ?? 1}&limit=${
        limit ?? 999999
      }${querySearch}${queryOrder}${queryDeleted}`
    );

    response.data.items = response.data.items.map((row: ITenant) => {
      return {
        ...row,
        type: getNameTypeTenant(row.type),
        url: `${getBaseUrl()}/${row.slug}`,
        colors: `Cor Primária: ${row.colormain}, Cor Secundária: ${row.colorhigh}, Cor Texto; ${row.colorsecond}`,
      };
    });

    return response.data;
  },
  delete: async (id: number) => {
    const tenant = getSlug();

    const response = await BaseService.delete(`/${tenant}/API/Tenants${id}`);
    return response.data;
  },
  set: async (
    id: number | null,
    params: ITenant,
    images: {
      logo: File | null;
      bg_login: File | null;
      icon: File | null;
      touch: File | null;
    }
  ) => {
    const tenant = getSlug();

    const formData = new FormData();

    formData.append("tenant_id", String(params.tenant_id));
    if (params.name) formData.append("name", params.name);
    if (params.slug) formData.append("slug", params.slug);
    if (params.parent_id)
      formData.append("parent_id", String(params.parent_id));
    if (params.whiteLabel)
      formData.append("whiteLabel", String(params.whiteLabel));
    if (params.downlimit)
      formData.append("downlimit", String(params.downlimit));
    if (params.customApproval)
      formData.append("customApproval", String(params.customApproval));

    if (params.colormain)
      formData.append("colormain", String(params.colormain.replace("#", "")));
    if (params.colorhigh)
      formData.append("colorhigh", String(params.colorhigh.replace("#", "")));
    if (params.colorsecond)
      formData.append(
        "colorsecond",
        String(params.colorsecond.replace("#", ""))
      );

    if (images.logo) formData.append("logo", images.logo);
    if (images.bg_login) formData.append("bg_login", images.bg_login);
    if (images.icon) formData.append("icon", images.icon);
    if (images.touch) formData.append("touch", images.touch);

    if (params.register) formData.append("register", String(params.register));
    if (params.register_validate)
      formData.append("register_validate", String(params.register_validate));
    if (params.register_setOrganization)
      formData.append(
        "register_setOrganization",
        String(params.register_setOrganization)
      );
    if (params.complete_fill)
      formData.append("complete_fill", String(params.complete_fill));
    if (params.register_asAnon)
      formData.append("register_asAnon", String(params.register_asAnon));
    if (params.jobs) formData.append("jobs", String(params.jobs));
    if (params.jobs_tree)
      formData.append("jobs_tree", String(params.jobs_tree));
    if (params.jobs_autocreate)
      formData.append("jobs_autocreate", String(params.jobs_autocreate));
    if (params.elearning)
      formData.append("elearning", String(params.elearning));
    if (params.products) formData.append("products", String(params.products));
    if (params.materials)
      formData.append("materials", String(params.materials));
    if (params.social) formData.append("social", String(params.social));
    if (params.sharedMedia)
      formData.append("sharedMedia", String(params.sharedMedia));
    if (params.tickets) formData.append("tickets", String(params.tickets));
    if (params.tickets_userview)
      formData.append("tickets_userview", String(params.tickets_userview));
    if (params.tickets_hourlimitreached)
      formData.append(
        "tickets_hourlimitreached",
        String(params.tickets_hourlimitreached)
      );
    if (params.tickets_deadline)
      formData.append("tickets_deadline", String(params.tickets_deadline));
    if (params.cookiejar)
      formData.append("cookiejar", String(params.cookiejar));
    if (params.privacyterms)
      formData.append("privacyterms", String(params.privacyterms));
    if (params.asaas_id) formData.append("asaas_id", String(params.asaas_id));

    formData.append("type", String(params.type));

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    let response;

    if (id) {
      response = await BaseService.put(
        `/${tenant}/API/Tenants/${id}`,
        formData,
        config
      );
    } else {
      response = await BaseService.post(`/${tenant}/API/Tenants`, params);
    }
    return response.data;
  },
};
