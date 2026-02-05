import { api } from './api';
import type { Courier, CreateBikeCourierRequest, CreateCarCourierRequest } from '../types';

export const courierService = {
  getAll: () => api.get<Courier[]>('/couriers'),
  getById: (id: string) => api.get<Courier>(`/couriers/${id}`),
  getAvailable: () => api.get<Courier[]>('/couriers/available'),
  getAvailableForWeight: (weight: number) => api.get<Courier[]>(`/couriers/available/${weight}`),
  createBike: (data: CreateBikeCourierRequest) => api.post<Courier>('/couriers/bike', data),
  createCar: (data: CreateCarCourierRequest) => api.post<Courier>('/couriers/car', data),
  delete: (id: string) => api.delete(`/couriers/${id}`),
};
