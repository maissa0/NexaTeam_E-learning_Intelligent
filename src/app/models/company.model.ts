export interface CompanyRegistrationRequest {
  id?: number;
  name: string;
  address?: string;
  logo?: string;
  emailCompany: string;
  description?: string;
  status?: RequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
} 