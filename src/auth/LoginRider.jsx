import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useProfileFunctions } from "../firebase/firebase";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginRider({ userType }) {
  const [loading, setLoading] = useState(false);
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
            type="submit"
            className={`flex items-center justify-center bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <div className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="my-2 w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="ml-2 text-white font-semibold">
                  Loading...
                </span>
              </div>
            )}
            {!loading && "Log In"}
          </button>
          <p className="text-md text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
                Sign up
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
