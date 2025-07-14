export interface IUser {
  user_id: number;
  tenant_slug: string;
  tenant_id: number;
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
  permissions?: string[];
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
