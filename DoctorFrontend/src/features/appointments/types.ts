export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type Patient = {
  id: number;
  patientCode: string;
  fullName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  guardianName?: string | null;
  phone: string;
  address?: string | null;
  notes?: string | null;
};

export type Appointment = {
  id: number;
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit?: string | null;
  status: AppointmentStatus;
  consumesCapacity: boolean;
  arrivedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  adminNote?: string | null;
};

export type AppointmentSlot = { time: string; available: boolean };

export type CreateAppointmentRequest = {
  patientName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  dateOfBirth?: string;
  gender?: string;
  guardianName?: string;
  address?: string;
  reasonForVisit?: string | null;
};

export type CreateAppointmentResponse = {
  appointmentId: number;
  patientCode: string;
  message: string;
};
