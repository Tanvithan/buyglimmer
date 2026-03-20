const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let currentCustomerId: string | null = null;
let token: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const couponApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async validate(couponCode: string, orderAmount: number) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        customerId: currentCustomerId,
        couponCode,
        orderAmount
      }
    };

    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to validate coupon');
    }

    const response = await res.json();
    return response.data; // { valid: boolean, discountAmount: number, message: string }
  }
};
