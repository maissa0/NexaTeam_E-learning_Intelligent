export interface Offer {
    id: string;
    title: string;
    description?: string;
    contractType: ContractType;
    createdAt: Date;
    viewCount?: number;  // Add this for view tracking
}

export enum ContractType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE'
}