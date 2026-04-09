
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  useMock: import.meta.env.VITE_USE_MOCK
    ? import.meta.env.VITE_USE_MOCK === 'true'
    : false,
};
