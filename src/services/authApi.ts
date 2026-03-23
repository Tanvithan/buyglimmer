const AUTH_API_URL = (import.meta.env.VITE_AUTH_API_URL || '');

export const authApi = {
  async login(email: string, password: string) {
    const res = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password: password })
    });

    const response = await res.json();

    if (!res.ok || !response.success) {
      throw new Error(response.message || 'Login failed');
    }

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user || {}));
    }

    return { token: response.token, user: response.user };
  },

  async register(name: string, email: string, phone: string, password: string) {
    const res = await fetch(`${AUTH_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: "",
        requestId: `REQ-${Date.now()}`,
        data: {
          name: name,
          email: email,
          password: password,
          phone: phone
        }
      })
    });
    
    const response = await res.json();  

    

    if (!res.ok || !response.success) {
      throw new Error(response.message || 'Registration failed');
    }

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user || {}));
    }

    return { token: response.token, user: response.user };
  },

  async resetPassword(email: string, newPassword: string) {
    const res = await fetch(`${AUTH_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, newPassword: newPassword })
    });

    const response = await res.json();

    if (!res.ok || !response.success) {
      throw new Error(response.message || 'Password reset failed');
    }

    return response;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
