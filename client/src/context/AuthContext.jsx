/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AUTH_STORAGE_KEYS } from "../constants/app.js";
import api from "../services/api.js";
import { loginRequest } from "../services/authService.js";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  for (const storage of [localStorage, sessionStorage]) {
    const token = storage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const storedUser = storage.getItem(AUTH_STORAGE_KEYS.USER);

    if (token && storedUser) {
      try {
        return { storage, token, user: JSON.parse(storedUser) };
      } catch {
        storage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        storage.removeItem(AUTH_STORAGE_KEYS.USER);
      }
    }
  }

  return null;
};

const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback(async ({ role, roleId, password, remember }) => {
    const data = await loginRequest({ role, roleId, password });
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
    storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }, []);

  useEffect(() => {
    const restoreAuth = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth) {
        setLoading(false);
        return;
      }

      setToken(storedAuth.token);

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
        storedAuth.storage.setItem(
          AUTH_STORAGE_KEYS.USER,
          JSON.stringify(response.data),
        );
      } catch {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
