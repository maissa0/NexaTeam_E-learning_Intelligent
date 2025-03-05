export interface JobOfferDto {
  id?: number;
  title?: string;
  description?: string;
  location?: string;
  contractType?: string;
  experienceLevel?: string;
  requiredSkills?: string[];
}