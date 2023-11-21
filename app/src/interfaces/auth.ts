import {User} from "src/interfaces/user";

export interface LoginRequest {
  email: string,
  password: string,
}
export interface LoginResponse {
    message: string,
    data: {
      user: User,
      token: string,
      sessionTimeout: number
    }
}
export interface ForgotPasswordResponse {
    message: string,
    data: [],
}
export interface ResetPasswordRequest {
  email: string,
  password: string,
  password_confirmation: string,
  token: string,
}
export interface ResetPasswordResponse {
    message: string,
}

export interface AutoLoginResponse{
  message: string,
  data: {
    user: User,
    sessionTimeout: number,
    isUserSessionActive: boolean
  },

}

