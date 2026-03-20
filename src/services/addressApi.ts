const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let token: string | null = null;
let currentCustomerId: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const addressApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async addAddress(address: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    addressType: string;
  }) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
        type: address.addressType || 'Home',
        addressLine: address.addressLine1 || address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: false
      }
    };

    const res = await fetch(`${API_BASE}/address/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to add address');
    }

    const response = await res.json();
    return response.data;
  },

  async getAddresses() {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: { customerId: currentCustomerId }
    };

    const res = await fetch(`${API_BASE}/address/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch addresses');
    }

    const response = await res.json();
    return response.data || [];
  },

  async deleteAddress(addressId: string) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: { addressId, customerId: currentCustomerId }
    };

    const res = await fetch(`${API_BASE}/address/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to delete address');
    }

    const response = await res.json();
    return response.data;
  }
};
