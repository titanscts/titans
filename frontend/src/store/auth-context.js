import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const userType = parseInt(localStorage.getItem("type"));
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const loginHandler = (data, type) => {
    console.log(data, type);
    setToken(data.jwtToken);
    localStorage.setItem("token", data.jwtToken);
    localStorage.setItem("type", type);
  };
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("type");
  };

  const contextValue = {
    token: token,
    type: userType,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
