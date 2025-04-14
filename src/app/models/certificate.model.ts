export interface Certificate {
  id: string;
  title: string;
  fromWhere: string;
  fileType: string;
  data?: any;
  user?: any;
}

export interface CertResponse {
  fileName: string;
  downloadURL: string;
  fileType: string;
  fileSize: number;
} 