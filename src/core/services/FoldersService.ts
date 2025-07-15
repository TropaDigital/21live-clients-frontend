import { getSlug } from "../utils/params-location";
import BaseService from "./BaseService";

export const FoldersService = {
  getMenu: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Folders/menu`);
    return response.data;
  },
  get: async ({
    id,
    sort,
    search,
  }: {
    id?: string;
    sort: string;
    search?: string | null;
  }) => {
    const tenant = getSlug();

    if (search) {
      const response = await BaseService.get(
        `/${tenant}/API/Folders/search/${search}`
      );

      const dataFolders = response.data.items.name.filter(
        (obj: any) => obj.folder_id
      );
      const dataFiles = response.data.items.name.filter(
        (obj: any) => obj.file_id
      );
      const dataLinks = response.data.items.name.filter(
        (obj: any) => obj.link_id
      );
      const dataVideos = response.data.items.name.filter(
        (obj: any) => obj.video_id
      );

      return {
        item: {
          breacrumb: [
            {
              name: "Início",
              folder_id: null,
            },
            {
              name: "Busca: " + search,
              folder_id: null,
            },
          ],
          children: {
            folders: dataFolders,
            files: dataFiles,
            links: dataLinks,
            videos: dataVideos,
          },
          childrenCount: {
            folders: dataFolders.length,
            files: dataFiles.length,
            videos: dataLinks.length,
            links: dataVideos.length,
          },
        },
      };
    } else {
      const response = await BaseService.get(
        `/${tenant}/API/Folders${id ? `/${id}` : ``}${
          sort ? `/?sort=${sort}` : ``
        }`
      );
      return response.data;
    }
  },
  getPermissions: async (id: number | string) => {
    const tenant = getSlug();
    const response = await BaseService.get(
      `/${tenant}/API/Folders/${id}/permissions`
    );
    return response.data;
  },
  setPermissions: async ({
    folder_id,
    organizations,
    orggroups,
    users,
  }: {
    folder_id: number | string;
    organizations: number[];
    orggroups: number[];
    users: number[];
  }) => {
    const tenant = getSlug();

    const response = await BaseService.put(
      `/${tenant}/API/Folders/${folder_id}/permissions`,
      {
        organizations,
        orggroups,
        users,
      }
    );

    return response.data;
  },
  getTree: async () => {
    const tenant = getSlug();
    const response = await BaseService.get(`/${tenant}/API/Folders/tree`);
    return response.data;
  },
  new: async ({
    parent_id,
    tenant_id,
    name,
  }: {
    parent_id: number | null;
    tenant_id: number;
    name: string;
  }) => {
    const tenant = getSlug();

    const response = await BaseService.post(`/${tenant}/API/Folders`, {
      tenant_id: tenant_id,
      parent_id: parent_id,
      name: name,
      icon: "folder",
      menulink: false,
      freedown: false,
      course: false,
      order: null,
      access: "public",
      listOrder: "created",
    });
    return response.data;
  },
  delete: async ({ id }: { id: number }) => {
    const tenant = getSlug();

    const response = await BaseService.delete(`/${tenant}/API/Folders/${id}`);
    return response.data;
  },
  update: async ({
    folder_id,
    parent_id,
    tenant_id,
    name,
    icon,
    menulink,
    order,
    access,
  }: {
    folder_id: number;
    parent_id: number | null;
    tenant_id: number;
    name: string;
    icon: string;
    menulink?: boolean;
    order?: number;
    access?: string;
  }) => {
    const tenant = getSlug();

    const paylaod = {
      folder_id,
      parent_id,
      tenant_id,
      name,
      icon,
      menulink,
      access,
      order,
    };

    if ( !access ) delete paylaod.access
    if ( !menulink ) delete paylaod.menulink
    if ( !order ) delete paylaod.order

    const response = await BaseService.put(
      `/${tenant}/API/Folders/${folder_id}`,
      paylaod
    );

    return response.data;
  },
};
