const API_BASE = (import.meta.env.VITE_BRAND_API_URL || '') + '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let token: string | null = null;
const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const deliveryApi = {
  setToken(newToken: string) {
    token = newToken;
  },
  async create(orderId: string, courierName: string, trackingNumber: string, estimatedDeliveryDate?: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        orderId,
        courierName,
        trackingNumber,
        estimatedDeliveryDate
      }
    };

    const res = await fetch(`${API_BASE}/delivery/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create delivery record');
    }

    const response = await res.json();
    return response.data;
  },

  async getDetail(deliveryId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        deliveryId
      }
    };

    const res = await fetch(`${API_BASE}/delivery/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch delivery details');
    }

    const response = await res.json();
    return response.data;
  },

  async updateStatus(deliveryId: string, status: string, currentLocation?: string, remarks?: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {
        deliveryId,
        status,
        currentLocation,
        remarks
      }
    };

    const res = await fetch(`${API_BASE}/delivery/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update delivery status');
    }

    const response = await res.json();
    return response.data;
  }
};
