export interface ICountries {
  country_id: number;
  name: string;
  name_eng: string;
  abbr: string;
  phone_code: string;
}

export interface IState {
  state_id: number;
  country_id: number;
  name: string;
  abbr: string;
}

export interface ICitie {
  city_id: number;
  state_id: number;
  name: string;
}
