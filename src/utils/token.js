const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const setTokens = (access , refresh) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};