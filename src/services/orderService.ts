import { api } from './api';
import type { Order, CreateOrderRequest } from '../types';

export const orderService = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getByCustomer: (customerId: string) => api.get<Order[]>(`/orders/customer/${customerId}`),
  create: (data: CreateOrderRequest) => api.post<Order>('/orders', data),
  confirm: (id: string) => api.post<Order>(`/orders/${id}/confirm`),
  process: (id: string) => api.post<Order>(`/orders/${id}/process`),
  markReady: (id: string) => api.post<Order>(`/orders/${id}/ready`),
  cancel: (id: string) => api.post<Order>(`/orders/${id}/cancel`),
};
