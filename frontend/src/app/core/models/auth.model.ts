
export interface SignupData {
  userName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string
}


export interface SignupResponse {
  status: string;
  message: string;
}


export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
}
export interface LoginData {
  email?: string;
  phoneNumber?:string;
  password: string;
}


export interface LoginResponse {
  status: string;
  message: string;
  accessToken: string;
  refreshToken: string;
 

}



export interface ForgetPasswordData {
  email: string;
}
export interface ForgetPasswordResponse {
  status: string;
  message: string;
}
export interface ResetPasswordData {
  email: string;
  newPassword: string;
  code: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}