import { api } from './api'

// Strategy
export interface DeliveryQuoteRequest {
  distanceKm: number
  weightKg: number
  strategy: string
}
export interface DeliveryQuoteResponse {
  strategy: string
  cost: number
  etaMinutes: number
}

export const quoteService = {
  strategies: () => api.get<string[]>('/delivery-quote/strategies'),
  quote: (req: DeliveryQuoteRequest) => api.post<DeliveryQuoteResponse>('/delivery-quote', req),
  compare: (req: DeliveryQuoteRequest) =>
    api.post<DeliveryQuoteResponse[]>('/delivery-quote/compare', req),
}

// Observer
export interface DeliveryEvent {
  at: string
  deliveryId: string
  from: string
  to: string
}

export const eventsService = {
  channels: () => api.get<string[]>('/delivery-events/channels'),
  events: () => api.get<DeliveryEvent[]>('/delivery-events'),
  subscribeEmail: (email: string) =>
    api.post<string>(`/delivery-events/subscribe-email?email=${encodeURIComponent(email)}`),
  subscribeSms: (phone: string) =>
    api.post<string>(`/delivery-events/subscribe-sms?phone=${encodeURIComponent(phone)}`),
  simulate: (deliveryId: string, action: string) =>
    api.post<string>(
      `/delivery-events/simulate-status?deliveryId=${deliveryId}&action=${action}`
    ),
}

// Command
export interface CommandHistory {
  history: string[]
  canUndo: boolean
  canRedo: boolean
}

export const dispatchService = {
  execute: (deliveryId: string, action: string) =>
    api.post<CommandHistory>('/dispatch/execute', { deliveryId, action }),
  undo: () => api.post<CommandHistory>('/dispatch/undo'),
  redo: () => api.post<CommandHistory>('/dispatch/redo'),
  history: () => api.get<CommandHistory>('/dispatch/history'),
  clear: () => api.post<void>('/dispatch/clear'),
}

// Memento
export interface DraftLine {
  productName: string
  quantity: number
  unitPrice: number
  weight: number
}
export interface DraftState {
  lines: DraftLine[]
  priority: string
  deliveryNotes: string | null
  total: number
}
export interface DraftSnapshot {
  label: string
  savedAt: string
}

export const draftService = {
  state: () => api.get<DraftState>('/order-draft'),
  addLine: (line: DraftLine) => api.post<DraftState>('/order-draft/lines', line),
  removeLine: (index: number) => api.delete(`/order-draft/lines/${index}`),
  setPriority: (priority: string) => api.post<DraftState>(`/order-draft/priority/${priority}`),
  save: (label: string) => api.post<DraftSnapshot[]>('/order-draft/save', { label }),
  snapshots: () => api.get<DraftSnapshot[]>('/order-draft/snapshots'),
  restore: (label: string) => api.post<DraftState>('/order-draft/restore', { label }),
}

// Iterator
export interface CourierIteratorRequest {
  mode: string
  vehicleType?: string | null
  roundRobinSteps?: number | null
}
export interface CourierIteratorResponse {
  mode: string
  courierNames: string[]
}

export const iteratorService = {
  walk: (req: CourierIteratorRequest) =>
    api.post<CourierIteratorResponse>('/courier-iterator', req),
}
