

export const authApi = {
  async login(email: string, password: string) {
    const res = await fetch(`/auth/login`, {
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
    const res = await fetch(`/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        mobile: phone,
        password: password
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
    // Reset password currently may not be fully implemented in Sabbpe auth, but point to it
    const res = await fetch(`/auth/reset-password`, {
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
