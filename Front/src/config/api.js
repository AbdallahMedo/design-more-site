export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// Uploaded images live on the API host, not the frontend host.
export const apiAssetUrl = (value) => {
  if (!value || /^(?:https?:|data:|blob:|\/\/)/i.test(value)) return value;
  return `${API_BASE_URL}/${value.replace(/^\/+/, '')}`;
};
