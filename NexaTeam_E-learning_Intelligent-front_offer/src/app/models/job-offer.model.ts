export interface JobOffer {
    id: string;
    title: string;
    company: string;
    description: string;
    contractType: ContractType;
    location: JobLocation;
    department: string;
    experienceLevel: ExperienceLevel;
    requiredSkills: string;
    createdAt: Date;
    status: string;
    isFavorite: boolean;
    viewCount: number;
}

export enum ContractType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE'
}

export enum JobLocation {
    REMOTE = 'REMOTE',
    ON_SITE = 'ON_SITE',
    HYBRID = 'HYBRID'
}

export enum ExperienceLevel {
    JUNIOR = 'JUNIOR',
    MID_LEVEL = 'MID_LEVEL',
    SENIOR = 'SENIOR',
    EXPERT = 'EXPERT'
}

