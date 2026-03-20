const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let currentCustomerId: string | null = null;
let token: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const returnApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async create(orderId: string, reason: string, comments?: string) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        orderId,
        customerId: currentCustomerId,
        reason,
        comments
      }
    };

    const res = await fetch(`${API_BASE}/returns/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create return request');
    }

    const response = await res.json();
    return response.data;
  },

  async getDetail(returnId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        returnId
      }
    };

    const res = await fetch(`${API_BASE}/returns/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to load return detail');
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

    const res = await fetch(`${API_BASE}/returns/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to load returns');
    }

    const response = await res.json();
    return response.data;
  }
};
