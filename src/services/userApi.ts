const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let currentCustomerId: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const userApi = {
  setCustomerId(customerId: string) {
    currentCustomerId = customerId;
  },

  async getProfile() {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: localStorage.getItem('token') || undefined,
      data: {
        customerId: currentCustomerId,
      }
    };

    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const response = await res.json();
    return response.data;
  },

  async updateProfile(name: string, email: string, mobile: string) {
    if (!currentCustomerId) throw new Error('Customer ID not set');

    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: localStorage.getItem('token') || undefined,
      data: {
        customerId: currentCustomerId,
        name,
        email,
        mobile
      }
    };

    const res = await fetch(`${API_BASE}/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update user profile');
    }

    const response = await res.json();
    return response.data;
  }
};
