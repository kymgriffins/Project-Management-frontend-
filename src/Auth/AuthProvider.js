import React, { createContext, useState, useEffect, useContext} from "react";
import { useCookies } from "react-cookie";
import jwt_decode from 'jwt-decode';

// Create the auth context
export const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies(['token']);
  const [authState, setAuthState] = useState({
    token: cookies.token || null,
    authenticated: cookies.token ? true : false,
    user: cookies.token ? jwt_decode(cookies.token) : {}
  });
  console.log("isAuthenticated?",authState.authenticated)

  useEffect(() => {
    const token = cookies.token;
    console.log("Token", token)
    if (token) {
        setAuthState({ token, authenticated: true, user: jwt_decode(token) });
    }
  }, [cookies.token]);

  const login = (token) => {
    setCookie("token", token, { path: "/home" });
    setAuthState({ token, authenticated: true, user: jwt_decode(token) });
  };

  const logout = () => {
    setCookie("token", null, { path: "/" });
    setAuthState({ token: null, authenticated: false });
  };

 

  // Return the provider with the auth state and login/logout methods
  return (
    <AuthContext.Provider
      value={{ authState, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
// Custom hook to access auth state and login/logout methods
export const useAuth = () => {
  const { authState, login, logout } = useContext(AuthContext);
  return { authState, login, logout };
};

