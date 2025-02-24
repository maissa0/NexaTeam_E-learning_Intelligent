export interface Interview {
    interviewId?: string; // Optional since MongoDB auto-generates it
    applicationId: string;
    scheduledDateTime: string; // Store as ISO string (convert LocalDateTime)
    meetingLink?: string;
    recordingLink?: string;
    status: InterviewStatus;
    createdAt?: string;
  }
  
  export enum InterviewStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
  }
  