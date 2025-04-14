export interface AuditLog {
  id: number;
  action: string;
  username: string;
  certificationId?: string;
  certificationName?: string;
  timestamp: string;
} 