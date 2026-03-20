const API_BASE = '/api/v1';

interface ApiRequest<T> {
  requestId: string;
  token?: string;
  data: T;
}

let token: string | null = null;

const generateRequestId = () => Math.random().toString(36).substring(2, 15);

export const productApi = {
  setToken(newToken: string) {
    token = newToken;
  },

  async list() {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: {}
    };

    const res = await fetch(`${API_BASE}/products/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const response = await res.json();
    return response.data || [];
  },

  async getById(productId: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: { productId }
    };

    const res = await fetch(`${API_BASE}/products/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch product');
    }

    const response = await res.json();
    return response.data;
  },

  async search(query: string) {
    const request: ApiRequest<any> = {
      requestId: generateRequestId(),
      token: token || undefined,
      data: { query }
    };

    const res = await fetch(`${API_BASE}/products/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to search products');
    }

    const response = await res.json();
    return response.data || [];
  },
};
