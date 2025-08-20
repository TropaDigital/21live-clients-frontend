export interface ITenant {
  tenant_id: number;
  name: string;
  slug: string;
  colormain: string; // Cor principal no formato HEX
  colorsecond: string; // Cor secundária no formato HEX
  colorhigh: string; // Cor de destaque no formato HEX
  language_id: number;
  whiteLabel: boolean;
  downlimit: boolean;
  customApproval: boolean;
  register: boolean;
  register_asAnon: boolean;
  register_validate: boolean;
  register_setOrganization: boolean;
  jobs: boolean;
  jobs_tree: null | any; // Substitua 'any' por uma interface específica se houver estrutura conhecida
  jobs_autocreate: null | any; // Substitua 'any' conforme necessário
  complete_fill: boolean;
  referral: boolean;
  elearning: boolean;
  products: boolean;
  social: boolean;
  sharedMedia: boolean;
  materials: boolean;
  tickets: boolean;
  tickets_name: string;
  tickets_color: string; // Cor no formato HEX
  tickets_btn: string; // Cor no formato HEX
  tickets_userview: boolean;
  allow_hour_limit: boolean;
  asaas_id: string | number;
  termset: boolean;
  tickets_deadline: number; // Número de horas (0 = sem prazo)
  tickets_hourlimitreached: null | any; // Substitua por tipo específico se conhecido
  cookiejar: boolean;
  privacyterms: null | string; // Assumindo que pode ser string ou null
  type: string;
  parent_name: string;
  user_limit: number;
  created: string; // Data no formato ISO (YYYY-MM-DD HH:MM:SS)
  updated: string; // Data no formato ISO (YYYY-MM-DD HH:MM:SS)
  deleted: null | string; // Data no formato ISO ou null
  tickets_defaultfields: number;
  parents?: ITenant[];
  parent_id: number | null;
  children: ITenant[];
  images: {
    logo: string; // URL da imagem
    bg_login: string; // URL da imagem
    icon: string; // URL favicon
    touch: string; // URL do icone PWA
  };
}
