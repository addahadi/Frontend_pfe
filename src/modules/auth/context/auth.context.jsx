import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from "../../../utils/token";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!token && !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // If we have no access token but have a refresh token, the interceptor
        // won't help us because it only triggers on 401.
        // We can just call getMe and let the interceptor handle the 401 if token is expired.
        // But if token is completely missing, the interceptor won't trigger 401 because no request is sent.
        // Actually, if we send getMe without token, it will 401, then interceptor will refresh!
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.log("Auth init failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
