const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let token: string | null = null;
let currentCustomerId: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const cartApi = {
  setToken(newToken: string) {
    token = newToken;
  },

  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async add(productId: string, variantId: string | null = null, quantity: number) {
    if (!currentCustomerId) throw new Error('Customer ID not set');
    
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
        productId,
        variantId,
        quantity,
      }
    };

    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to add to cart');
    }

    const response = await res.json();
    return response.data;
  },

  async get() {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
      }
    };

    const res = await fetch(`${API_BASE}/cart/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch cart');
    }

    const response = await res.json();
    return response.data || [];
  },

  async update(cartItemId: string, quantity: number) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        cartItemId,
        quantity,
      }
    };

    const res = await fetch(`${API_BASE}/cart/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update cart item');
    }

    const response = await res.json();
    return response.data;
  },

  async remove(cartItemId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        cartItemId,
      }
    };

    const res = await fetch(`${API_BASE}/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to remove cart item');
    }

    const response = await res.json();
    return response.data;
  },
};
