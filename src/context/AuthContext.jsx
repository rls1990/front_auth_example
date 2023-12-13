/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { login, refreshAT, verify } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    verifyTokens();
  }, []);

  const singin = async (user) => {
    try {
      const res = await login(user);
      if (res.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);

        Cookies.set("aToken", res.data.accessToken, {
          secure: true,
          expires: new Date(Date.now() + 5 * 60 * 1000), //5m
          sameSite: "none",
        });

        Cookies.set("rToken", res.data.refreshToken, {
          secure: true,
          expires: 1, // 1 día
          sameSite: "none",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    Cookies.remove("aToken");
    Cookies.remove("rToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  const verifyTokens = () => {
    const cookies = Cookies.get();
    if (!cookies.rToken) {
      //If there is no refresh token, I close the session
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      Cookies.remove("aToken");
    } else if (!cookies.aToken) {
      generateAT(); //If the refresh token exists but the access token does not exist, I generate it
    } else {
      verifyAT(); //If the refresh token and the access token exist, I verify the access token
    }
  };

  const verifyAT = async () => {
    const res = await verify().catch((err) => {
      console.log(err);
      setIsAuthenticated(false);
      logout();
      return;
    });

    if (res && res.data) {
      setIsAuthenticated(true);
      setLoading(false);
      setUser(res.data.user);
    }
  };

  const generateAT = async () => {
    const res = await refreshAT().catch((err) => {
      console.log(err);
      setIsAuthenticated(false);
      logout();
      return;
    });

    if (res && res.data) {
      Cookies.set("aToken", res.data.accessToken, {
        secure: true,
        expires: new Date(Date.now() + 5 * 60 * 1000), //5m
        sameSite: "none",
      });

      setIsAuthenticated(true);
      setLoading(false);
      setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        singin,
        logout,
        loading,
        verifyTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
