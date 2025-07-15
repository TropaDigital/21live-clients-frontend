export interface IDashBanner {
  banner_id: number;
  tenant_id: number;
  title: string;
  description: string;
  link: string;
  fullLink: string;
  path: string;
  urlFullPath: string;
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
  user_id: number;
  title: string;
  msg: string;
  type: string;
  access: string;
  path: string;
  aws: number | null;
  tenant_id: number;
  created: string;
  updated: string;
  user: {
    user_id: number;
    organization_id: number;
    tenant_id: number;
    username: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    aws: number;
    email2: string;
    whatsapp: string;
    downlimit: number;
    need_fill: number;
    dummy: number;
    askpswd: number;
    remember_token: string;
    remember_expires: string;
    referralkey: string;
    whats_country_id: number;
    referraluser_id: number | null;
    created: string;
    updated: string;
    footer: string | null;
  };
  thumb: string;
}
