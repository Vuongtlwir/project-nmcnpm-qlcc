import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const res = await authService.getMe();
          // authService.getMe may return either the user object
          // or a wrapped response { success, message, data }
          const me = res?.data || res;
          setUser(me || null);
        }
      } catch (err) {
        console.error("Failed to load current user", err);
        sessionStorage.removeItem("token");
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      // authService.login may return either { token, user }
      // or wrapped response { success, message, data: { token, user } }
      const payload = res?.data || res;
      const token = payload?.token || payload?.data?.token;
      const userObj = payload?.user || payload?.data || payload;

      if (token) {
        sessionStorage.setItem("token", token);
        setUser(userObj || null);
        return userObj;
      }
      throw new Error("Login failed");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Login failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);