import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useProfileFunctions } from "../firebase/firebase";

const SignUpDriver = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const { createUser } = useProfileFunctions();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const storedSaccoData = localStorage.getItem("selectedSacco");
    const parsedData = JSON.parse(storedSaccoData);
    const formattedData = {
      ...data,
      userType: userType.user,
      sacco: parsedData,
    };
    // Handle form submission here
    console.log(formattedData);
    try {
      setLoading(true);

      const response = await createUser(formattedData);
      if (response.user.uid) {
        localStorage.clear();
        localStorage.setItem("username", data.fullName);
        console.log("response >>", response);
        setLoading(false);
        reset();
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);

      throw error;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-3xl my-5">Sign up</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Controller
              name="fullName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg pl-10"
                  placeholder="Full Name"
                />
              )}
            />
            {errors.fullName && (
              <span className="text-red-600">Full name is required</span>
            )}
          </div>

          <div className="mb-4">
            <Controller
              name="email"
              control={control}
              rules={{ required: true, pattern: /^\S+@\S+$/i }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg pl-10"
                  placeholder="Email"
                />
              )}
            />
            {errors.email && (
              <span className="text-red-600">Valid email is required</span>
            )}
          </div>

          <div className="mb-4">
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg pl-10"
                  placeholder="Password"
                />
              )}
            />
            {errors.password && (
              <span className="text-red-600">Password is required</span>
            )}
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#F66E3C] border border-gray-400 rounded-md focus:ring-0 focus:ring-offset-0 mr-2"
              checked={watch("rememberPassword")}
              {...register("rememberPassword", { required: true })}
            />
            <span className="text-gray-600">Remember Password</span>
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#F66E3C] border border-gray-400 rounded-md focus:ring-0 focus:ring-offset-0 mr-2"
              checked={watch("agreed")}
              {...register("agreed", { required: true })}
            />
            <p className="text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-[#F66E3C]">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#F66E3C]">
                Privacy Policy
              </Link>
            </p>
            {errors?.agreed && (
              <p className="text-red-500">You must agree to the terms</p>
            )}
          </div>

          <button
            type="submit"
            className={`flex items-center justify-center  bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <>
                <svg
                  aria-hidden="true"
                  className="my-2 mr-3 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
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
              </>
            )}
            {!loading && "Sign Up"}
          </button>
        </form>

        <p className="text-md text-center mt-4">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
              Log in
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpDriver;
