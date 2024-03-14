import React, { createContext, useContext, useEffect, useState } from "react";

import { driverUser } from "../firebase/firebase";

const AuthContext = createContext();

export const useDriverAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  // Listen for auth state changes.
  //   Todo : add riderUser

  useEffect(() => {
    const unsubscribe = driverUser.onAuthStateChanged((driverUser) => {
      if (driverUser) {
        console.log("user exists!");
        console.log("user Details >>", driverUser);
        setDriver(driverUser);
      } else {
        setDriver(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { driverUser };
  console.log("User data > ", driverUser);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
