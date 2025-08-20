export interface IMedia {
  media_id: number;
  tenant_id: number;
  media_cat_id: number;
  media_cat_title: string;
  name: string;
  measure: string;
  sizeable: boolean;
  value: string;
  created: string | null;
  updated: string | null;
}

export interface IMediaCat {
  media_cat_id: number;
  tenant_id: number;
  title: string;
  created: string | null;
  updated: string | null;
}
