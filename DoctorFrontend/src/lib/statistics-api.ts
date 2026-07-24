import { apiRequest } from "@/lib/blog-api";

export type StatisticsSummary = {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  uniquePatients: number;
  newPatients: number;
  returningPatients: number;
  releasedAppointments: number;
  occupiedSlots: number;
  totalCapacity: number;
  completionRate: number;
  occupancyRate: number;
};

export type DailyPoint = {
  date: string;
  appointments: number;
  completed: number;
  pending: number;
  occupiedSlots: number;
  capacity: number;
  occupancyRate: number;
};

export type HourlyPoint = {
  time: string;
  appointments: number;
  completed: number;
  released: number;
  occupiedSlots: number;
};

export type StatisticsDashboard = {
  from: string;
  to: string;
  summary: StatisticsSummary;
  daily: DailyPoint[];
  hourly: HourlyPoint[];
  highlights: {
    busiestDate?: string | null;
    busiestDateAppointments: number;
    busiestTime?: string | null;
    busiestTimeAppointments: number;
  };
};

export const getStatistics = (from: string, to: string) =>
  apiRequest<StatisticsDashboard>(`/api/admin/statistics?from=${from}&to=${to}`);
