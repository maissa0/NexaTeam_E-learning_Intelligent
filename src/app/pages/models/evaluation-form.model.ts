export enum EvaluationStatus {
    PENDING = 'PENDING',
    SUBMITTED = 'SUBMITTED',
    REVIEWED = 'REVIEWED'
}

export interface EvaluationForm {
    evaluationId?: string;  // Optional since it's generated by MongoDB
    applicationId: string;
    evaluatorId: string;
    evaluatorName: string;
    scores: { [key: string]: number }; // Map<String, Integer> in Java becomes an object with string keys and number values
    overallFeedback: string;
    status: EvaluationStatus;
    createdAt: string; // LocalDateTime will be handled as string in frontend
} 