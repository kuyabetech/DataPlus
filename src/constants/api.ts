export const API_CONFIG = {
  BASE_URL: 'https://api.dataplus.com/v1',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY_TOKEN: '/auth/verify',
    },
    WALLET: {
      BALANCE: '/wallet/balance',
      GENERATE_ACCOUNT: '/wallet/generate-account',
      FUND: '/wallet/fund',
      TRANSACTIONS: '/wallet/transactions',
    },
    VTU: {
      BUY_DATA: '/vtu/data',
      BUY_AIRTIME: '/vtu/airtime',
      PAY_BILL: '/vtu/bill',
      GET_PLANS: '/vtu/plans',
      VERIFY_NUMBER: '/vtu/verify',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile/update',
      CHANGE_PASSWORD: '/user/change-password',
      SET_PIN: '/user/set-pin',
      VERIFY_PIN: '/user/verify-pin',
      KYC: '/user/kyc',
    },
    REFERRAL: {
      INFO: '/referral/info',
      CLAIM: '/referral/claim',
    },
  },
};

export const MONNIFY_CONFIG = {
  CONTRACT_CODE: 'YOUR_CONTRACT_CODE',
  API_KEY: 'YOUR_API_KEY',
  SECRET_KEY: 'YOUR_SECRET_KEY',
};