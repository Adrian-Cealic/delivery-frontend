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
  totalPrice: number;
  totalWeight: number;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  vehicleType: string;
  maxWeight: number;
  licensePlate: string | null;
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

export interface ApiError {
  error: string;
}
