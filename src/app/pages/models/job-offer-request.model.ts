export interface JobOfferRequest {
    title: string;
    description: string;
    requiredSkills: string[];
}

export interface QuestionResponse {
    category: string;
    question: string;
    mark?: number; // Optional since it's nullable and set later
} 