import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
const host = debuggerHost ?? 'localhost';

export const API_BASE = `http://${host}:8000`;
export const API_ENDPOINTS = {
  parseReceipt: `${API_BASE}/api/v2/parse-receipt`,
};