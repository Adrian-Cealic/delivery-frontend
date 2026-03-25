import type { Order } from '../types';

const API_BASE = 'http://localhost:5100/api';

async function requestWithRole<T>(url: string, role: string): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Role': role,
    },
  });

  if (response.status === 403) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Access denied');
  }

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
};
