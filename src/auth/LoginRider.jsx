import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useProfileFunctions } from "../firebase/firebase";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginRider({ userType }) {
  const { control, handleSubmit } = useForm();
  const { login } = useProfileFunctions();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = async (data) => {
    // const savedPassword = localStorage.getItem("passcode");
    console.log(data);
    const loginData = {
      email: `${data.username}@benkiko.io`,
      password: data.password,
    };
    try {
      if (data.password) {
        // Passwords match, you can continue here
        localStorage.setItem("isAuth", "true");
        const loginResponse = await login(loginData.email, loginData.password);
        if (loginResponse.success) {
          navigate("/home");
        } else {
          alert("error trying to login");
        }
      } else {
        // Passwords do not match, display an alert
        alert("Wrong password. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-3xl">Welcome back!</p>
        <p className="text-gray-600 mb-4">
          Enter your username and password to get started.
        </p>
        <div className="relative">
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="text"
                placeholder="Username"
                className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10"
                {...field}
              />
            )}
          />
        </div>
        <br />
        <div className="relative">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10"
                {...field}
              />
            )}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeSlashIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          By logging in, you agree to our Terms and Privacy Policy.
        </p>
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859]"
        >
          Log In
        </button>
        <p className="text-md text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup">
            <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
              Sign up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
