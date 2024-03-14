import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthUserDataFunctions } from "./AuthStateManager";
import SignUpDriver from "./SignUpDriver";
import SignUpRider from "./SignUpRider";

const SignUp = () => {
  const userType = useParams();
  console.log("userType >>", userType);

  if (userType?.user === "driver") {
    console.log("userType >>", userType);
    return <SignUpDriver userType={userType} />;
  } else if (userType.user === "rider") {
    console.log("userType >>", userType);
    return <SignUpRider userType={userType} />;
  }
};

export default SignUp;
