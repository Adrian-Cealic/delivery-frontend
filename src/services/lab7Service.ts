import { api } from './api'

// Chain of Responsibility
export interface ValidationLine {
  productName: string
  quantity: number
  unitPrice: number
  weight: number
  inStock: number
}
export interface OrderValidationRequest {
  customerId: string
  lines: ValidationLine[]
  distanceKm: number
  walletBalance: number
  customerCountry: string
}
export interface OrderValidationResponse {
  accepted: boolean
  passes: string[]
  failures: string[]
}

export const validationService = {
  validate: (req: OrderValidationRequest) =>
    api.post<OrderValidationResponse>('/order-validation', req),
}

// State
export interface StateSnapshot {
  currentState: string
  isTerminal: boolean
  failureReason: string | null
  trace: string[]
}

export const stateService = {
  current: () => api.get<StateSnapshot>('/delivery-state'),
  apply: (action: string, reason?: string) =>
    api.post<StateSnapshot>('/delivery-state/action', { action, reason: reason ?? null }),
}

// Mediator
export interface MediatorBroadcast {
  registered: string[]
  log: string[]
  notifierEmitted: string[]
}

export const mediatorService = {
  state: () => api.get<MediatorBroadcast>('/mediator'),
  register: (kind: 'order' | 'courier', name: string) =>
    api.post<MediatorBroadcast>('/mediator/register', { kind, name }),
  dispatch: (orderId: string) =>
    api.post<MediatorBroadcast>(`/mediator/dispatch?orderId=${encodeURIComponent(orderId)}`),
}

// Template Method
export interface ReceiptRequest {
  kind: 'order' | 'delivery' | 'refund'
  id: string
  refundAmount?: number | null
  refundReason?: string | null
  customerName?: string | null
  courierName?: string | null
}
export interface ReceiptResponse {
  kind: string
  body: string
}

export const receiptService = {
  generate: (req: ReceiptRequest) => api.post<ReceiptResponse>('/receipts', req),
}

// Visitor
export interface VisitorRow {
  courier: string
  vehicle: string
  result: string
}
export interface VisitorResponse {
  visitor: string
  rows: VisitorRow[]
}

export const visitorService = {
  run: (visitor: string) => api.post<VisitorResponse>('/courier-visitor', { visitor }),
}
