import type { IOrganization } from "./IOrganization";
import type { ITenant } from "./iTenants";

export interface IUser {
  user_id: number;
  tenant_slug: string;
  tenant_id: number;
  tenants?: ITenant[];
  organizations?: IOrganization[];
  username: string;
  name: string;
  email: string;
  whatsapp: string | null; // Permitindo null caso o campo seja opcional
  downlimit: number; // 0 = false, 1 = true (poderia ser boolean se preferir)
  need_fill: boolean;
  askpswd: boolean;
  avatar: string | null; // URL ou null se não tiver avatar
  created: string; // DateTime no formato 'YYYY-MM-DD HH:MM:SS'
  updated: string;
  deleted: string | null; // DateTime ou null se não deletado
  role?: IUserRole;
  role_title?: string;
  role_id?: number;
  permissions?: string[];
  organization_id?: number;
  organization_name?: string;
}

export interface IUserRole {
  role_id: number;
  tenant_id: number;
  title: string;
  description: string;
  level: number;
  module: string;
  created: string;
  updated: string;
}
