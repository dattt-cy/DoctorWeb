export interface Service {
  id: string;
  title: string;
  description: string;
  introduction: string;
  commonConditions: string[];
  whenToVisit: string[];
  urgentSigns: string[];
  parentNotes: string[];
  faqs: { question: string; answer: string }[];
  icon: string;
  featured?: boolean;
  size?: "small" | "medium" | "large" | "wide";
}
