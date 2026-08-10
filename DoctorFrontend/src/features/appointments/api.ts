import { apiRequest } from "@/shared/api/client";
import type {
  AppointmentSlot,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from "./types";

export const getAvailability = (date: string) =>
  apiRequest<AppointmentSlot[]>(`/api/public/appointments/availability?date=${date}`);

export const createAppointment = (payload: CreateAppointmentRequest) =>
  apiRequest<CreateAppointmentResponse>("/api/public/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
