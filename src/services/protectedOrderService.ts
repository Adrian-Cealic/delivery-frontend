import type { Order } from '../types';

const API_BASE = 'http://localhost:5100/api';

async function requestWithRole<T>(url: string, role: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Role': role,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 403) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? data.Error ?? 'Access denied');
  }

  if (response.status === 400) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? data.Error ?? 'Bad request');
  }

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export const protectedOrderService = {
  getAll: (role: string) =>
    requestWithRole<Order[]>('/orders/protected', role),
  getById: (id: string, role: string) =>
    requestWithRole<Order>(`/orders/protected/${id}`, role),
  confirm: (id: string, role: string) =>
    requestWithRole<Order>(`/orders/protected/${id}/confirm`, role, 'POST'),
  cancel: (id: string, role: string) =>
    requestWithRole<Order>(`/orders/protected/${id}/cancel`, role, 'POST'),
  delete: (id: string, role: string) =>
    requestWithRole<void>(`/orders/protected/${id}`, role, 'DELETE'),
};
