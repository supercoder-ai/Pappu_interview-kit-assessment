import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, FC } from "react";
import type { User } from "../types/shared";
import { getItem, removeItem, setItem } from "../services/localstorage";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() =>
    getItem<User>("currentUser")
  );

  useEffect(() => {
    if (user) {
      setItem("currentUser", user);
    } else {
      removeItem("currentUser");
    }
  }, [user]);

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);
  };

  const logout = () => {
    setUserState(null);
    removeItem("currentUser");
  };

  const value = useMemo(
    () => ({ user, setUser, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
