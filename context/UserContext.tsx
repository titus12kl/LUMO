import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  password: string;
  photo?: string | null;
};

type UserContextType = {
  user: User | null;
  register: (data: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  };

  const register = async (data: User) => {
    await AsyncStorage.setItem("registeredUser", JSON.stringify(data));
    await AsyncStorage.setItem("currentUser", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email: string, password: string) => {
    const stored = await AsyncStorage.getItem("registeredUser");
    if (!stored) return false;

    const parsed: User = JSON.parse(stored);

    if (parsed.email === email && parsed.password === password) {
      await AsyncStorage.setItem("currentUser", JSON.stringify(parsed));
      setUser(parsed);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
