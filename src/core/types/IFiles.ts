export type IUploadFileParams = {
  file_id?: number;
  folder_id: number;
  tenant_id: number;
  name: string;
  path: File;
  thumb?: File;
  tags?: string;
  customizable?: boolean;
  dpi?: number;
  cmyk?: boolean;
  publishable?: boolean;
  social_caption?: string;
  social_hashtags?: string;
};
