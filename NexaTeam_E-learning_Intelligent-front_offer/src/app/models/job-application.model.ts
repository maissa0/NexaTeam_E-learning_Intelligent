export enum JobApplicationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED'
}

export interface JobApplication {
  id?: number;
  name: string;
  email: string;
  telephone: string;
  resume: string;
  coverLetter?: string;
  status: string;
  submissionDate: Date;
  jobOfferId?: string;
}