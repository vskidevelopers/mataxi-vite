import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { useAuthUserDataFunctions } from "./AuthStateManager";
import { useProfileFunctions } from "../firebase/firebase";

const CreatePassword = () => {
  const { createUserTokens } = useAuthUserDataFunctions();
  const { createUser, updateDriverProfile } = useProfileFunctions();
  const userType = useParams();
  console.log("user Type from create password >>", userType.user);
  const navigate = useNavigate();
  const { control, handleSubmit, register, watch, errors } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (prevState) => {
    setPasswordVisible(!passwordVisible);
    console.log("prev state >>", prevState);
    console.log("current state >>", passwordVisible);
  };

  const toggleConfirmPasswordVisibility = (prevState) => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
    console.log("prev state >>", prevState);
    console.log("current state >>", confirmPasswordVisible);
  };

  const onSubmit = async (data) => {
    // Handle form submission here, data object contains form values
    console.log(data);
    const username = localStorage.getItem("username");
    const mnemonics = localStorage.getItem("mmemonics");
    const public_key = localStorage.getItem("publicKey");
    const secret_key = localStorage.getItem("secretKey");

    try {
      if (data.password === data.confirmPassword) {
        console.log("Password Matches! Safe to proceed!");
        localStorage.setItem("passcode", data.password);

        const userRes = await createUserTokens();
        if (userRes) {
          // Display a success message or redirect to a success page
          console.log("user response from createPassword >>", userRes);
          if (
            (userRes.status === "success" && userType.user === "Rider") ||
            userType.user === "rider"
          ) {
            console.log("USERrES dATA FROM CREATE pASSWORD >> ", userRes);
            const riderData = {
              userType: userType.user,
              email: `${username}@benkiko.io`,
              username: username,
              password: data.password,
              mmemonics: mnemonics,
              paymail: userRes?.data?.paymail,
              public_key: userRes?.data?.["public key"],
              secret_key: userRes?.data?.["secret key"],
            };

            const newRiderRes = await createUser(riderData);
            if (newRiderRes.success) {
              alert("Account Created Successfully");
              navigate(`/signup/${userType.user}/complete`);
            } else {
              alert("Something went wrong while creating account");
              navigate(`/signup`);
            }
          } else if (
            userRes.status === "success" &&
            userType.user === "Driver"
          ) {
            const driverData = {
              mmemonics: mnemonics,
              paymail: userRes.data.paymail,
              public_key: public_key,
              secret_key: secret_key,
            };

            const newDriverRes = await updateDriverProfile(driverData);
            if (newDriverRes.status === "success") {
              alert("Account Created Successfully");
              navigate(`/signup/${userType.user}/complete`);
            } else {
              alert("Something went wrong while creating account");
              navigate(`/signup`);
            }
          }
        } else {
          console.error("User creation failed");
        }
      } else {
        console.error("Passwords do not match");
      }
    } catch (error) {
      console.error("Error: ", error || "Something went wrong");
      // You can also display an error message to the user
    }
  };

  return (
    <div className=" inset-0  z-20 first-letter:">
      <div className=" w-full h-full z-50 flex items-center justify-center top-28">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl  ">
          <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
            Mataxi
          </h1>
          <p className="text-gray-600 font-bold text-xl">Confirm Your Phrase</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <p className="text-gray-600">
                Paste your mnemonic phrase here...
              </p>
              <Controller
                name="mnemonicPhrase"
                control={control}
                defaultValue=""
                rules={{ required: "Mnemonic phrase is required" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg mt-2"
                    rows="4"
                    placeholder="Paste your mnemonic phrase here..."
                  />
                )}
              />
              {errors?.mnemonicPhrase && (
                <p className="text-red-500">Mnemonic phrase is required</p>
              )}
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                {userType.user === "Rider"
                  ? "Create Password"
                  : "Enter your password"}
              </p>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Create Password"
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10 mt-2"
                    />
                  )}
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 focus:outline-none"
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.password && (
                <p className="text-red-500">Password is required</p>
              )}
            </div>
            {/* ... (Confirm Password field and checkbox) */}

            <div className="mt-4">
              <p className="text-gray-600">Confirm Password</p>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10 mt-2"
                    />
                  )}
                />
                <button
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 focus:outline-none"
                >
                  {confirmPasswordVisible ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors?.confirmPassword && (
                <p className="text-red-500">
                  {errors?.confirmPassword?.message}
                </p>
              )}
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
              className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
            >
              Create your password
            </button>
          </form>
          <p className="text-md text-center mt-4">
            Already have a wallet?{" "}
            <Link to={`/signup/${userType.user}/import-wallet`}>
              <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
                Import
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
