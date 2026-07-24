import { apiRequest } from "@/lib/blog-api";

export type AppointmentStatus =
  | "PENDING" | "CONFIRMED" | "ARRIVED" | "IN_PROGRESS"
  | "COMPLETED" | "CANCELLED" | "NO_SHOW";

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

export type Slot = { time: string; available: boolean };

export const getAvailability = (date: string) =>
  apiRequest<Slot[]>(`/api/public/appointments/availability?date=${date}`);

export const createAppointment = (payload: Record<string, unknown>) =>
  apiRequest<{ appointmentId: number; patientCode: string; message: string }>(
    "/api/public/appointments", { method: "POST", body: JSON.stringify(payload) }
  );
