export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured?: boolean;
  size?: "small" | "medium" | "large" | "wide";
}
