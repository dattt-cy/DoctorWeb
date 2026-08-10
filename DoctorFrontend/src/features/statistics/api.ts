import { apiRequest } from "@/shared/api/client";
import type { StatisticsDashboard } from "./types";

export const getStatistics = (from: string, to: string) =>
  apiRequest<StatisticsDashboard>(`/api/admin/statistics?from=${from}&to=${to}`);
