import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ClipboardDocumentIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthUserDataFunctions } from "./AuthStateManager";
import { useNavigate } from 'react-router-dom';
const Mnemonics = () => {
  const [copied, setCopied] = useState(false);
  const { userData, mmemonics } = useAuthUserDataFunctions();
  const [mnemonicPhrase, setMnemonicPhrase] = useState(userData.mmemonics);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMnemonicPhrase(localStorage.getItem("mmemonics")); // Update the state when userData.mmemonics changes
  }, [userData.mmemonics]); // Watch for changes in userData.mmemonics

  console.log("mmemonics >>", mnemonicPhrase);
  const userType = useParams();
  console.log("user type >>", userType.user);

  // Function to copy text to the clipboard
  const copyToClipboard = () => {
    if (mnemonicPhrase) {
      // Create a textarea element to hold the text
      const textarea = document.createElement("textarea");
      textarea.value = mnemonicPhrase;
      document.body.appendChild(textarea);

      // Select and copy the text
      textarea.select();
      document.execCommand("copy");

      // Remove the textarea
      document.body.removeChild(textarea);

      // You can show a success message or perform other actions as needed
      console.log("Mnemonic phrase copied to clipboard:", mnemonicPhrase);
      setCopied(true);
      // Reset the text back to "Copy Phrase" after a short delay
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleButtonClick = () => {
    setLoading(true);

    const redirectPath =
      userType.user === 'Rider' || userType.user === 'rider'
        ? `/signup/${userType.user}/create-password`
        : `/settings/${userType.user}/settings/paymail/confirm-mmemonics`;

    // Simulate loading for 1.5 seconds
    setTimeout(() => {
      setLoading(false);
      navigate(redirectPath);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-xl">Your Mnemonic Phrase</p>
        <div className="bg-[#F66E3C08] border border-[#F66E3C26] rounded-lg py-4 px-6 mt-4">
          {mnemonicPhrase?.split(" ").map((word, index) => (
            <div
              key={index}
              className="inline-block my-1  bg-[#F66E3C08] border border-[#F66E3C26] rounded-full px-3 py-1 m-1"
            >
              {word}
            </div>
          ))}
          <div className="w-full flex justify-end items-center">
            <button
              onClick={copyToClipboard}
              className="bg-[#F66E3C14] text-[#F66E3C] py-2 px-4 rounded-lg hover:bg-[#F57859] hover:text-white flex items-center"
            >
              <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
              {copied ? "Copied" : "Copy Phrase"}
            </button>
          </div>
        </div>
        <div className="my-3">
          <p className="text-gray-600 ">
            <InformationCircleIcon className="w-5 h-5 inline-block mr-2  text-[#F19521]" />
            Your mnemonic phrase is the key to your account. Please copy it and
            store it in a safe place. Without it, you risk losing access to your
            assets.
          </p>
        </div>
        <Link
          to={
            userType.user === "Rider" || userType.user === "rider"
              ? `/signup/${userType.user}/create-password`
              : `/settings/${userType.user}/settings/paymail/confirm-mmemonics`
          }
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
        >
          Create Your Password
        </Link>
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
  );
};

export default Mnemonics;
