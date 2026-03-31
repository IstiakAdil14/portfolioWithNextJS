import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [clientDetailsSaved, setClientDetailsSaved] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clientDetailsSaved");
      return saved === "true";
    }
    return false;
  });

  const [passwordSet, setPasswordSet] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("passwordSet");
      return saved === "true";
    }
    return false;
  });

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedEmail = localStorage.getItem("email");
    if (token) {
      setAccessToken(token);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentClientDetailsSaved =
        localStorage.getItem("clientDetailsSaved");
      if (
        currentClientDetailsSaved !== (clientDetailsSaved ? "true" : "false")
      ) {
        localStorage.setItem(
          "clientDetailsSaved",
          clientDetailsSaved ? "true" : "false"
        );
      }
      const currentPasswordSet = localStorage.getItem("passwordSet");
      if (currentPasswordSet !== (passwordSet ? "true" : "false")) {
        localStorage.setItem("passwordSet", passwordSet ? "true" : "false");
      }
    }
  }, [clientDetailsSaved, passwordSet]);

  const login = (token, email) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    if (email) {
      localStorage.setItem("email", email);
      setEmail(email);
    }
  };

  const logout = () => {
    setLoggingOut(true);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("clientDetailsSaved");
    localStorage.removeItem("passwordSet");
    localStorage.removeItem("profileRegistered");
    localStorage.removeItem("registrationProcessing");
    setAccessToken(null);
    setEmail(null);
    setClientDetailsSaved(false);
    setPasswordSet(false);
    setLoggingOut(false);
  };

  const forceUpdate = () => {
    setUpdateFlag((prev) => !prev);
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        email,
        login,
        logout,
        isAuthenticated,
        forceUpdate,
        clientDetailsSaved,
        setClientDetailsSaved,
        passwordSet,
        setPasswordSet,
        loading,
        loggingOut,
        setLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
