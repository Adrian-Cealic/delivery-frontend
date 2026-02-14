import { api } from './api';
import type { Courier, CreateCourierRequest, CreateBikeCourierRequest, CreateCarCourierRequest, CreateDroneCourierRequest } from '../types';

export const courierService = {
  getAll: () => api.get<Courier[]>('/couriers'),
  getById: (id: string) => api.get<Courier>(`/couriers/${id}`),
  getAvailable: () => api.get<Courier[]>('/couriers/available'),
  getAvailableForWeight: (weight: number) => api.get<Courier[]>(`/couriers/available/${weight}`),
  create: (data: CreateCourierRequest) => api.post<Courier>('/couriers', data),
  createBike: (data: CreateBikeCourierRequest) => api.post<Courier>('/couriers/bike', data),
  createCar: (data: CreateCarCourierRequest) => api.post<Courier>('/couriers/car', data),
  createDrone: (data: CreateDroneCourierRequest) => api.post<Courier>('/couriers/drone', data),
  delete: (id: string) => api.delete(`/couriers/${id}`),
};
