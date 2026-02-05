import { api } from './api';
import type { Delivery, AssignDeliveryRequest } from '../types';

export const deliveryService = {
  getAll: () => api.get<Delivery[]>('/deliveries'),
  getById: (id: string) => api.get<Delivery>(`/deliveries/${id}`),
  getByOrder: (orderId: string) => api.get<Delivery>(`/deliveries/order/${orderId}`),
  getByCourier: (courierId: string) => api.get<Delivery[]>(`/deliveries/courier/${courierId}`),
  assign: (data: AssignDeliveryRequest) => api.post<Delivery>('/deliveries', data),
  markPickedUp: (id: string) => api.post<Delivery>(`/deliveries/${id}/pickup`),
  markInTransit: (id: string) => api.post<Delivery>(`/deliveries/${id}/transit`),
  markDelivered: (id: string) => api.post<Delivery>(`/deliveries/${id}/deliver`),
  markFailed: (id: string) => api.post<Delivery>(`/deliveries/${id}/fail`),
};
