export interface ITicketCat {
  ticket_cat_id: number;
  tenant_id: number;
  title: string;
  setas_default: boolean;
  use_title: boolean;
  default_fields: boolean;
  ordem: number;
  allow_files: boolean;
  use_media: boolean;
  default_media_id: number | null;
  private: boolean;
  jobs: boolean;
  materials: string;
  created: string;
  updated: string | null;
}

export interface ITicketStatus {
  ticket_status_id: number;
  tenant_id: number;
  name: string;
  color: string;
  type: string;
  created: string;
  updated: string | null;
}

export interface ITicketField {
  ticketcat_field_id: number;
  ticket_cat_id: number;
  tenant_id: number;
  name: string;
  label: string;
  type: string;
  description: string;
  options: string[];
  required: boolean;
  ordem: number;
  created: string;
  updated: string | null;
}
