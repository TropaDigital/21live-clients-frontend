export interface IFolderMenu {
  folder_id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  icon: string; // Sugiro usar um enum se houver valores específicos
  menulink: boolean;
  freedown: boolean;
  course: boolean;
  order: number;
  access: "public" | "private" | "restricted"; // Exemplo com valores literais
  listOrder: "created" | "modified" | "name" | "custom"; // Tipos possíveis
  created: string; // DateTime ISO format
  updated: string; // DateTime ISO format
  _table: string; // Campo meta (opcional)
  _pk: string; // Campo meta (opcional)
}

export interface IFolderItem {
  folder_id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  icon: string;
  menulink: boolean;
  freedown: boolean;
  course: boolean;
  order: number;
  access: string;
  listOrder: string;
  created: string;
  updated: string;
  _table: string;
  _pk: string;
  breadcrumb: IFolderBreadcrumb[];
  children: IFolderChildren;
  childrenCount: Record<keyof IFolderChildren, number>;
}

export interface IFolderBreadcrumb {
  folder_id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  icon: string;
  menulink: boolean;
  freedown: boolean;
  course: boolean;
  order: number;
  access: string;
  listOrder: string;
  progress: any;
  completed: any;
  created: string;
  updated: string | null;
}

interface IFolderChildren {
  folders: IFolder[];
  links: IFolderLink[];
  videos: IFolderVideo[];
  quizzes: IFolderQuiz[];
  files: IFolderFileItem[];
}

export interface IFolder {
  folder_id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  icon: string;
  menulink: boolean;
  freedown: boolean;
  course: boolean;
  order: number;
  access: string;
  listOrder: string;
  created: string;
  updated: string;
  _table: string;
  _pk: string;
}

export interface IFolderLink {
  link_id: number;
  tenant_id: number;
  folder_id: number;
  name: string;
  type: string;
  target_type: string;
  target_id: number;
  icon: string | null;
  url: string | null;
  created: string;
  updated: string;
  _table: string;
  _pk: string;
}

export interface IFolderVideo {
  video_id: number;
  tenant_id: number;
  folder_id: number;
  name: string;
  host: string;
  code: string;
  tags: string;
  created: string;
  updated: string;
  _table: string;
  _pk: string;
  url_path: string;
  thumbnail: string;
}

export interface IFolderQuiz {
  quiz_id: number;
  tenant_id: number;
  folder_id: number;
  name: string;
  type: string;
  questions: string; // JSON string, pode tipar melhor se desejar
  path: string | null;
  thumbnail: string;
  created: string;
  updated: string;
  _table: string;
  _pk: string;
}

export interface IFolderFileItem {
  file_id: number;
  folder_id: number | null;
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
  url_inline: string;
  thumbnail: string;
}
