/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_BRAND_API_URL: string;
  readonly VITE_PAYMENT_ENV: string;
  readonly VITE_PAYMENT_RETURN_URL: string;
  readonly VITE_PAYMENT_RETURN_BACKEND_URL: string;
  readonly VITE_PAYMENT_TRANSACTION_USERID: string;
  readonly VITE_PAYMENT_TRANSACTION_MERCHANTID: string;
  readonly VITE_PAYMENT_CLIENT_ID: string;
  readonly VITE_MAIL_URL: string;
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_ENCRYPTION_IV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
