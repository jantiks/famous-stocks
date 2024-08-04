import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  userLoggedIn: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  userLoggedIn: false,
  setCurrentUser: () => {
    throw new Error("setCurrentUser function must be overridden");
  }
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  console.log("ASD AUTHPROVIDER CALLED")
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("ASD USEEFFECT AUTHPROVIDER")
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  function initializeUser(user: User | null) {
    console.log("ASD AUTHSTATE CHANGED", user)
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}