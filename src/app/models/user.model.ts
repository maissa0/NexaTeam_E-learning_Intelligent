export interface User {
  userId: number;
  userName: string;
  email: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  credentialsExpiryDate?: string;
  accountExpiryDate?: string;
  twoFactorSecret?: string;
  isTwoFactorEnabled: boolean;
  signUpMethod?: string;
  role?: Role;
  createdDate?: string;
  updatedDate?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  company?: Company;
}

export interface Role {
  roleId: number;
  roleName: string;
}

export interface Company {
  id: number;
  name: string;
  address?: string;
  logo?: string;
  emailCompany: string;
  description?: string;
}

export interface UserUpdateDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  twoFactorEnabled?: boolean;
  profilePicture?: string;
}

export interface AdminUserCreationDTO {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  jwtToken: string;
  username: string;
  roles: string[];
  is2faEnabled?: boolean;
}

export interface MessageResponse {
  message: string;
} 