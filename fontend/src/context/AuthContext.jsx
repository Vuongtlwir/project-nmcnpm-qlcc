import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import * as authService from "../services/authService";

const AuthContext =
  createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const me = await authService.getMe();
          setUser(me);
        }
      } catch (err) {
        console.error('Failed to load current user', err);
        localStorage.removeItem('token');
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res && res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);