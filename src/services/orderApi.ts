const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let token: string | null = null;
let currentCustomerId: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const orderApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async create(addressId: string, paymentMethod: string, items: { variantId: string; quantity: number; price: number }[], couponCode?: string) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
        addressId,
        couponCode: couponCode || null,
        paymentMethod,
        items
      }
    };

    const res = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create order');
    }

    const response = await res.json();
    return response.data;
  },

  async instantBuy(addressId: string, variantId: string, quantity: number, price: number, paymentMethod: string, couponCode?: string) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
        addressId,
        variantId,
        quantity,
        price,
        couponCode: couponCode || null,
        paymentMethod
      }
    };

    const res = await fetch(`${API_BASE}/orders/instant-buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create instant buy order');
    }

    const response = await res.json();
    return response.data;
  },

  async list() {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId
      }
    };

    const res = await fetch(`${API_BASE}/orders/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const response = await res.json();
    return response.data; // List<OrderSummaryResponse>
  },

  async getDetail(orderId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        orderId
      }
    };

    const res = await fetch(`${API_BASE}/orders/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch order details');
    }

    const response = await res.json();
    return response.data; // OrderDetailResponse
  }
};
