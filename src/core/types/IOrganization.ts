export interface IOrganization {
  organization_id: number;
  tenant_id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  name: string;
  address: string;
  email: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  website: string;
  social_footer: string;
  workhours: number;
  created: string;
  updated: string;
  deleted: string | null;
  images: {
    logo: string | null;
    logo_b: string | null;
    logo_w: string | null;
  };
}

export interface OrganizationResponse {
  count: number;
  items: IOrganization[];
  total: number;
}

export interface IOrganizationGroup {
  created: string;
  description: string;
  orggroup_id: number;
  tenant_id: number;
  title: string;
  updated: string;
  organizations: number[];
}
