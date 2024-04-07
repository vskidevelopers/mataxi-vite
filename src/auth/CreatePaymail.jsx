import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthUserDataFunctions } from "./AuthStateManager";
import { useProfileFunctions } from "../firebase/firebase";

function CreatePaymail({ userDetails }) {
  console.log("userDetails from create PAYMAIL >> ", userDetails);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const { control, handleSubmit, setValue } = useForm();
  const userType = useParams();
  const { generateMmemonics, userData, createWalletAutomatically } =
    useAuthUserDataFunctions();
  const { updateDriverProfile } = useProfileFunctions();
  const onSubmit = async (data) => {
    // Handle form submission logic here
    try {
      if (data.username != "") {
        console.log(data.username, "username");
        localStorage.setItem("username", data.username);
        const mnemonics = await generateMmemonics();
        if (userData.mmemonics) {
          console.log("if userData.mmemonics >>", userData);
          navigate(`mmemonics`);
        }
      } else {
        alert("Enter Username");
      }
    } catch (error) {
      console.log("error >>", error);
    }
  };

  const handleGenerateWalletAutomatically = async () => {
    setLoading(true);
    try {
      const autoWalletGenerationResponse = await createWalletAutomatically();
      console.log(
        "autoWalletGenerationResponse >> ",
        autoWalletGenerationResponse
      );
      const driverWalletData = {
        mmemonics: autoWalletGenerationResponse.mnemonics,
        paymail: autoWalletGenerationResponse.data.paymail,
        publicKey: autoWalletGenerationResponse.data["public key"],
        secretKey: autoWalletGenerationResponse.data["secret key"],
      };
      console.log("driverWallet Data >> ", driverWalletData);
      const driverUpdateResponse = await updateDriverProfile(driverWalletData);
      setLoading(false);
      navigate(`success`);
    } catch (error) {
      console.error(
        "ERROR OCCURED TRYING TO UPDATE THE DRIVER'S DATA >>",
        error
      );
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const handleUsernameChange = (event) => {
    let inputUsername = event.target.value.trim(); // Remove leading and trailing whitespaces
    inputUsername = inputUsername.toLowerCase(); // Convert to lowercase

    // Validate username (you can add your custom validation logic here)
    if (!inputUsername) {
      setUsernameError("Username is required");
    } else {
      setUsernameError(""); // Clear error if username is valid
    }

    // Update form field value
    setValue("username", inputUsername); // Ensure setValue is imported correctly and available here
  };

  return (
    <div className="inset-0 flex flex-col justify-center z-20 bg-white p-5 rounded-lg shadow-md ">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-3xl">Welcome !</p>
        <p className="text-gray-800 py-6 ">
          Enter your username to get started.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    placeholder="Username"
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10"
                    onChange={handleUsernameChange}
                  />
                  {usernameError && (
                    <span className="text-red-500">{usernameError}</span>
                  )}
                </>
              )}
            />
          </div>
          <button
            type="submit"
            className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] flex justify-center items-center"
          >
            Generate Phrase
          </button>
        </form>
      </div>
      <div className="text-center mt-6 mb-6">
        <span className="text-gray-600">or</span>
      </div>
      <button
        onClick={handleGenerateWalletAutomatically}
        className="bg-[#f66E3C] text-white rounded-full py-2 px-4 w-full hover:bg-[#f57859] flex justify-center items-center"
      >
        {loading
          ? "Loading ..."
          : "Click here to generate your wallet automatically"}
      </button>
      <p className="text-md t ext-center mt-4">
        Already have a wallet?{" "}
        <Link to={`/signup/${userType.user}/import-wallet`}>
          <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
            Import
          </span>
        </Link>
      </p>
    </div>
  );
}

export default CreatePaymail;
