export interface Service {
  id: string;
  title: string;
  description: string;
  introduction: string;
  commonConditions: string[];
  examinationSteps: string[];
  parentNotes: string[];
  icon: string;
  featured?: boolean;
  size?: "small" | "medium" | "large" | "wide";
}
