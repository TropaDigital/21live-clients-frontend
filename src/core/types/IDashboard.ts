export interface IDashBanner {
  banner_id: number;
  tenant_id: number;
  title: string;
  description: string;
  link: string;
  path: string;
  order: number;
  screens: any;
  access: string;
  created: string;
  updated: string;
}

export interface IDashInfo {
  fileCount: number;
  customCount: number;
  ticketCount: number;
  jobsCount: number;
  mostDownloaded: {
    file_id: number;
    folder_id: number;
    user_id: number;
    tenant_id: number;
    name: string;
    path: string;
    thumb: string;
    tags: string;
    customizable: boolean;
    dpi: number;
    cmyk: boolean;
    publishable: boolean;
    social_caption: string | null;
    social_hashtags: string | null;
    aws: boolean;
    created: string;
    updated: string;
    _table: string;
    _pk: string;
    url_path: string;
    thumbnail: string;
  };
  mostMedia: {
    media_id: number;
    tenant_id: number;
    media_cat_id: number;
    name: string;
    measure: string;
    sizeable: boolean;
    value: number;
    created: string;
    updated: string;
  };
}

export interface IDashPost {
  message_id: number;
  tenant_id: number;
  user_id: number;
  title: string;
  msg: string;
  type: string;
  access: string;
  path: string;
  created: string;
  updated: string;

  avatar: string;
  name: string;
}
