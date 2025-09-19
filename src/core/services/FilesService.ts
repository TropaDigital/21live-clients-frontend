import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const FilesService = {
  get: async ({
    page = 1,
    offset = 0,
    limit = 50,
  }: {
    page: number;
    offset: number;
    limit: number;
  }) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Files?page=${page}&offset=${offset}&limit=${limit}`
    );
    return response.data;
  },
  set: async (params: any, options: any = {}) => {
    const {
      file_id,
      folder_id,
      tenant_id,
      name,
      path,
      thumb,
      tags,
      customizable,
      dpi,
      cmyk,
      publishable,
      social_caption,
      social_hashtags,
    } = params;

    const tenant = getSlug();
    const formData = new FormData();

    formData.append("folder_id", String(folder_id));
    formData.append("tenant_id", String(tenant_id));
    if (name) formData.append("name", name);

    if (path) formData.append("path", path);
    if (thumb) formData.append("thumb", thumb);
    if (tags) formData.append("tags", tags);
    if (customizable !== undefined)
      formData.append("customizable", String(customizable));
    if (dpi !== undefined) formData.append("dpi", String(dpi));
    if (cmyk !== undefined) formData.append("cmyk", String(cmyk));
    if (publishable !== undefined)
      formData.append("publishable", String(publishable));
    if (social_caption) formData.append("social_caption", social_caption);
    if (social_hashtags) formData.append("social_hashtags", social_hashtags);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      ...options, // permite onUploadProgress ou outros headers
    };

    let response;

    if (file_id) {
      response = await BaseService.put(
        `/${tenant}/API/files/${file_id}`,
        formData,
        config
      );
    } else {
      response = await BaseService.post(
        `/${tenant}/API/files`,
        formData,
        config
      );
    }

    return response.data;
  },
  delete: async ({ id }: { id: number }) => {
    const tenant = getSlug();
    const response = await BaseService.delete(`/${tenant}/API/Files/${id}`);
    return response.data;
  },
};
