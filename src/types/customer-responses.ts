export interface CustomerContact {
  id: number;
  name?: string | null;
  email?: string | null;
  mobile?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  contacts?: CustomerContact[];
  createdAt: string;
  updatedAt: string;
  dealCount: number;
  totalDealSize: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  customers: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type CustomersResponse = PaginatedResponse<Customer>;

export interface CustomerResponse {
  success: boolean;
  item: Customer;
}
