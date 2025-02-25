export interface offer {
    id: string;
    title: string;
     contractType: ContractType;
     createdAt: Date;
    }
    export enum ContractType {
        FULL_TIME = 'FULL_TIME',
        PART_TIME = 'PART_TIME',
        INTERNSHIP = 'INTERNSHIP',
        FREELANCE = 'FREELANCE'
    }