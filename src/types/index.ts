export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  weight: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: string;
  priority: string;
  totalPrice: number;
  totalWeight: number;
  deliveryNotes: string | null;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
  priority?: string;
  deliveryNotes?: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  vehicleType: string;
  maxWeight: number;
  licensePlate: string | null;
  maxFlightRangeKm: number | null;
}

export interface CreateCourierRequest {
  vehicleType: string;
  name: string;
  phone: string;
  licensePlate?: string;
  maxFlightRangeKm?: number;
}

export interface CreateBikeCourierRequest {
  name: string;
  phone: string;
}

export interface CreateCarCourierRequest {
  name: string;
  phone: string;
  licensePlate: string;
}

export interface CreateDroneCourierRequest {
  name: string;
  phone: string;
  maxFlightRangeKm: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  courierId: string;
  status: string;
  assignedAt: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  distanceKm: number;
  estimatedDeliveryTime: string | null;
}

export interface AssignDeliveryRequest {
  orderId: string;
  courierId: string;
  distanceKm: number;
}

export interface SystemConfig {
  systemName: string;
  maxDeliveryDistanceKm: number;
  defaultCurrency: string;
  maxOrderItems: number;
}

export interface ApiError {
  error: string;
}

export interface CatalogNode {
  name: string;
  totalPrice: number;
  totalWeight: number;
  children: CatalogNode[];
}

export interface PlaceOrderItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  weight: number;
}

export interface PlaceOrderRequestDto {
  customerId: string;
  items: PlaceOrderItemDto[];
  paymentGateway: string;
  deliveryNotes?: string;
  currency?: string;
  priority?: string;
}

export interface OrderPlacementResponseDto {
  orderId: string | null;
  deliveryId: string | null;
  success: boolean;
  message: string;
}
