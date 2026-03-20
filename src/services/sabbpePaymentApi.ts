export const sabbpePaymentApi = {
  
  async getToken(merchantOrderRef: string) {
    // Generate timestamp in YYYY-MM-DD HH:mm:ss format natively to match timezone
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const d = new Date();
    const timestamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    const res = await fetch('https://pymntsuat.sabbpe.com/sabbpe/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sabbpe_userid: "665887",
        sabbpe_merchantid: "998776",
        sabbpe_password: "Test@123456",
        timestamp,
        merchant_order_ref: merchantOrderRef
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Sabbpe token: ${res.status}`);
    }

    const data = await res.json();
    if (!data.sabbpe_token) {
       throw new Error(`Invalid token response: ${JSON.stringify(data)}`);
    }
    return data;
  },

  async initiate(
    amount: number, 
    productInfo: string, 
    customerParams: { firstname: string, email: string, phone: string }, 
    sabbpeToken: string,
    frontendUrl: string
  ) {
    const res = await fetch('https://pymntsuat.sabbpe.com/sabbpe/v1/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        productinfo: productInfo,
        customer: customerParams,
        sabbpe_token: sabbpeToken,
        frontend_url: frontendUrl,
        encrypted_order_ref: null
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to initiate Sabbpe payment: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }
};
