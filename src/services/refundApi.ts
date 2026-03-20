const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let currentCustomerId: string | null = null;
let token: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const refundApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async create(returnId: string, paymentId: string, amount: number, reason: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        returnId,
        paymentId,
        amount,
        reason
      }
    };

    const res = await fetch(`${API_BASE}/refunds/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create refund');
    }

    const response = await res.json();
    return response.data;
  },

  async getDetail(refundId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        refundId
      }
    };

    const res = await fetch(`${API_BASE}/refunds/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to load refund detail');
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

    const res = await fetch(`${API_BASE}/refunds/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to load refunds');
    }

    const response = await res.json();
    return response.data;
  }
};
