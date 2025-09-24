export interface ITicketDetail {
  ticket_id: number;
  ticket_cat_id: number;
  ticket_status_id: number;
  user_id: number;
  organization_id: number;
  media_id: number;
  title: string;
  width: number | null;
  height: number | null;
  context: string | null;
  info: string | null;
  target: string | null;
  obs: string | null;
  file_format: string | null;
  workminutes: number;
  finished: string | null;
  deadline: string | null;
  tenant_id: number;
  created: string;
  updated: string;
  app: string;

  ticket_cat: {
    ticket_cat_id: number;
    tenant_id: number;
    title: string;
    use_title: number;
    setas_default: number;
    default_fields: number;
    use_media: number;
    allow_files: number;
    materials: string | null;
    created: string;
    updated: string;
    default_media_id: number | null;
    private: number;
    jobs: number;
  };

  ticket_status: {
    ticket_status_id: number;
    tenant_id: number;
    name: string;
    color: string;
    type: string;
    created: string;
    updated: string;
  };

  user: {
    user_id: number;
    organization_id: number | null;
    organization_name: string | null;
    tenant_id: number;
    role_id: number;
    role_title: string;
    username: string;
    name: string;
    email: string;
    email2: string | null;
    whats_country_id: number;
    whatsapp: string;
    avatar: string;
    downlimit: number;
    need_fill: boolean;
    askpswd: number;
    created: string;
    updated: string;
    deleted: string | null;
  };

  organization: any | null; // pode tipar melhor se tiver o schema da org

  media: {
    media_id: number;
    tenant_id: number;
    media_cat_id: number;
    name: string;
    measure: string;
    sizeable: number;
    value: number;
    created: string;
    updated: string | null;
  };

  fields: any[]; // se tiver schema dos fields, dá pra tipar também
}

export interface ITicketInteraction {
  ticket_interaction_id: number;
  ticket_id: number;
  reply_id: null | number;
  user_id: number;
  custom_id: null | number;
  message: string;
  annex: string;
  annex_title: string;
  annex_jobs: boolean;
  thumbnail: string;
  task_file?: ITicketInteractionFile;
  task_text?: ITicketInteractionText;
  status: "pass" | "fail" | "wait" | null;
  user_name: string;
  user_avatar: string;
  access: string;
  created: string;
  updated: string;
}

export interface ITicketInteractionFile {
  task_file_id: number;
  task_id: number;
  file_name: string;
  project_id: number | null;
  url: string | null;
  size: string; // ex: "99000 bytes"
  key: string;
  bucket: string;
  status: string;
  products_delivery_id: number;
  last_archive: string; // observe: no boolean, no null — no formato consistente no payload
  ticket_interaction_id: number;
  original_name: string;
  tenant_id: number | null;
  created: string; // ISO datetime string
  updated: string; // ISO datetime string
  user_id: number;
  position: number;
  job_service: string;
}

export interface ITicketInteractionText {
  task_text_id: number;
  parent_id: number;
  task_id: number;
  products_delivery_id: number;
  ticket_interaction_id: number;
  user_id: number;
  annex_text: string; // HTML string
  status: string;
  last_archive: string; // vem como "false" ou "true" (string)
  tenant_id: number | null;
  created: string; // datetime string
  updated: string; // datetime string
  job_service: string;
}

export interface ITicketFile {
  ticket_file_id: number;
  ticket_id: number;
  name: null | string;
  path: string;
  created: string;
  updated: string;
  thumbnail: string;
}

export interface ITicket {
  ticket_id: number;
  tenant_id: number;
  ticket_cat_id: number;
  ticket_status_id: number;
  user_id: number;
  organization_id: number;
  media_id: number;
  app: string;
  title: string;
  width: null | number | string;
  height: null | number | string;
  info: null | string;
  target: null | string;
  obs: null | string;
  file_format: null | string;
  workminutes: number;
  deadline: string;
  created: string;
  updated: string;
  finished: null | string;
  ticket_cat_title: string;
  ticket_status_name: string;
  ticket_status_color: string;
  user_avatar: string;
  user_name: string;
  organization_name: string;
  media_name: string;
  notifications: number;
  awaiting_approval: number;
  lastUpdate: string;
  jobs_deadline: string;
}

export interface ITicketApproval extends ITicket {
  awaiting_approval_interactions: ITicketInteraction[];
}

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
  fields: ITicketField[] | null;
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
