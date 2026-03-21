export const sabbpePaymentApi = {
  
  async getToken(merchantOrderRef: string) {
    // Generate timestamp in YYYY-MM-DD HH:mm:ss format natively to match timezone
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const d = new Date();
    const timestamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    const payload = {
      sabbpe_userid: "665889",
      sabbpe_merchantid: "998778",
      sabbpe_password: "Test@123456",
      timestamp,
      merchant_order_ref: merchantOrderRef
    };

    console.log("SENDING SABBPE TOKEN PAYLOAD:", JSON.stringify(payload, null, 2));

    const res = await fetch('https://pymntsuat.sabbpe.com/sabbpe/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
    frontendUrl: string,
    merchantOrderRef: string
  ) {
    const payload = {
      sabbpe_userid: "665889",
      sabbpe_password: "Test@123456",
      sabbpe_merchantid: "998778",
      sabbpe_token: sabbpeToken,
      amount,
      productinfo: productInfo,
      merchant_order_ref: merchantOrderRef,
      frontend_url: frontendUrl,
      customer: customerParams
    };

    console.log("SENDING SABBPE INITIATE PAYLOAD:", JSON.stringify(payload, null, 2));

    const res = await fetch('https://pymntsuat.sabbpe.com/sabbpe/v1/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to initiate Sabbpe payment: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }
};
