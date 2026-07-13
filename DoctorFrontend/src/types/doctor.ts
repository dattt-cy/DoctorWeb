export interface DoctorProfile {
  name: string;
  title: string;
  specialty: string;
  tagline: string;
  bio: string;
  quote: string;
  photo: string;
  photoAlt: string;
  photoAbout: string;
  yearsExperience: number;
  patientsCount: string;
  hospital: string;
  degree: string;
  email: string;
  phone: string;
  address: string;
  workingHours: {
    weekdays: string;
    saturday: string;
  };
  currentPositions: string[];
  education: Array<{ year: string; description: string }>;
  memberships: string[];
  socialLinks: {
    facebook?: string;
    youtube?: string;
    zalo?: string;
    tiktok?: string;
  };
}
