
export interface User {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  date_of_birth: string,
  role: string,
  league: string,
  referee_type: string,
  active: boolean
}

export interface StoreRequest{
  id?: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  date_of_birth: string,
  role: string,
  league: string,
  referee_type: string,
  active:  boolean,
}
