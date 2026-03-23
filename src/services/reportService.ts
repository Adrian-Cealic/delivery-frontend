import { api } from './api';
import type { ReportResponse } from '../types';

export const reportService = {
  getOrderReport: (format: string) =>
    api.get<ReportResponse>(`/reports/orders?format=${format}`),
  getDeliveryReport: (format: string) =>
    api.get<ReportResponse>(`/reports/deliveries?format=${format}`),
};
