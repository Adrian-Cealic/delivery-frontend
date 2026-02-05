import { api } from './api';
import type { Customer, CreateCustomerRequest } from '../types';

export const customerService = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: string) => api.get<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerRequest) => api.post<Customer>('/customers', data),
  update: (id: string, data: CreateCustomerRequest) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};
