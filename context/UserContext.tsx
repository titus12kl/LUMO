import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  photo?: string | null;
};

type UserContextType = {
  user: User | null;
  register: (data: User) => void;
  logout: () => void;
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
    const stored = await AsyncStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  };

  const register = async (data: User) => {
    setUser(data);
    await AsyncStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, register, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
