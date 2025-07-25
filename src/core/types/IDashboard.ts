import type { IFolderFileItem } from "./iFolder";
import type { IUser } from "./iUser";

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

//graphs
interface ITenant {
  tenant_id: number;
  name: string;
  slug: string;
  bucket: string;
  colormain: string;
  colorsecond: string;
  colorhigh: string;
  parent_id: number | null;
  language_id: number;
  whiteLabel: number;
  downlimit: number;
  customApproval: number;
  apikey: string;
  register: number;
  register_validate: number;
  register_setOrganization: number;
  jobs: number;
  jobs_tree: string;
  jobs_autocreate: string;
  complete_fill: number;
  referral: number;
  elearning: number;
  products: number;
  social: number;
  sharedMedia: number;
  materials: number;
  tickets: number;
  tickets_name: string;
  tickets_color: string;
  tickets_btn: string;
  tickets_userview: number;
  tickets_deadline: number;
  tickets_hourlimitreached: string | null;
  cookiejar: number;
  privacyterms: string | null;
  type: string;
  user_limit: number;
  price_fee: number | null;
  price_user: number | null;
  price_sub: number | null;
  created: string;
  updated: string;
  tickets_defaultfields: number;
}

export interface IStatusFreq {
  status: string[];
  values: number[];
  colors: string[];
}

export interface IUserAccess {
  users: string[];
  values: number[];
}

export interface IUnitStatusDataset {
  label: string;
  backgroundColor: string;
  data: Record<string, number>;
}

export interface IUnitStatus {
  labels: Record<string, string>;
  datasets: Record<string, IUnitStatusDataset>;
}

export interface IUnitTickets {
  units: string[];
  values: number[];
  total: number;
}

export interface IFileDownloads {
  files: string[];
  values: number[];
}

export interface IMediaTickets {
  medias: string[];
  values: number[];
}

export interface IUserDownloads {
  users: string[];
  values: number[];
  total: number;
  step: number;
}

export interface IDashboardInfo {
  tenant: ITenant;
  user: IUser;
  mode: string;
  hour: number;
  statusFreq: IStatusFreq;
  lastDownloads: IFolderFileItem[] | null;
  courses: null | {
    completed: CourseItem[];
    ongoing: CourseItem[];
    notstarted: CourseItem[];
  };
  userAccess: IUserAccess;
  unitStatus: IUnitStatus;
  unitTickets: IUnitTickets;
  fileDownloads: IFileDownloads;
  mediaTickets: IMediaTickets;
  userDownloads: IUserDownloads;
  fromAPI: boolean;
}

export type UnitStatusData = {
  labels: Record<string, string>;
  datasets: Record<
    string,
    {
      label: string;
      backgroundColor: string;
      data: Record<string, number>;
    }
  >;
};

export interface CourseItem {
  folder_id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  icon: string;
  menulink: number;
  freedown: number;
  course: number;
  order: number;
  access: string;
  listOrder: string;
  progress: number;
  completed: string | null;
  created: string;
  updated: string;
}

export interface ICourses {
  completed: CourseItem[];
  ongoing: CourseItem[];
  notstarted: CourseItem[];
}