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

export interface UsersResponse {
    message:string,
    data:{
      users: User[]
    }
}

export enum AccountState {
  ALL = -1,
  ACTIVE = 1,
  INACTIVE = 0,
}
export interface UserDetailsResponse{
    message:string,
    data: {
      user: User
    }
}
export interface StoreNewUserRequest {
  name: string,
  surname: string,
  email: string
}
export interface StoreNewUserResponse{
    message:string,
    data:{
      user: User
    }
}

export interface ResendActivationEmailResponse {
  message: string
}

