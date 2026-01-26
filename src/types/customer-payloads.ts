export interface UpdateCustomerPayload {
  name?: string;
}

export interface CreateCustomerContactPayload {
  name?: string;
  email?: string;
  mobile?: string;
}

export interface CreateCustomerContactsPayload {
  contacts: CreateCustomerContactPayload[];
}

export interface UpdateCustomerContactPayload {
  name?: string;
  email?: string;
  mobile?: string;
}

export interface CustomerContactForm {
  name?: string;
  email?: string;
  mobile?: string;
}

export interface CreateCustomerPayload {
  name: string;
  contacts: CustomerContactForm[];
}
