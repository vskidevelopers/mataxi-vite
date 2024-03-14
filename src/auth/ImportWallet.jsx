import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

const ImportWallet = () => {
  const [walletNotFound, setWalletNotFound] = useState(false);

  const handleImportWallet = () => {
    // Check if the wallet exists (replace with your logic)
    const walletExists = false; // Set this to true if the wallet exists

    if (!walletExists) {
      setWalletNotFound(true);
      return;
    }

    // Continue with the import logic
    // ...
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-xl">
          To import your existing wallet into Mataxi
        </p>
        <div className="bg-[#F66E3C08] rounded-lg py-4 px-6 mt-4">
          <div className="mb-2">
            <label className="block text-gray-600">
              Enter your preferred username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600">
              Paste your mnemonic phrase here
            </label>
            <input
              type="text"
              placeholder="Mnemonic Phrase"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={() => setWalletNotFound(true)}
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
        >
          Create your password
        </button>
        <p className="text-md text-center mt-4">
          Don't have a wallet yet?{" "}
          <Link
            to="/signup"
            className="text-[#f66E3C] text-lg font-bold cursor-pointer"
          >
            Create an Account
          </Link>
        </p>
      </div>
      {walletNotFound && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="text-[#F66E3C] text-4xl text-center mb-4">
              <ExclamationTriangleIcon className="w-12 h-12 inline-block" />
            </div>
            <p className="text-gray-600 text-lg text-center">
              Wallet Not Found
            </p>
            <p className="text-gray-600 mt-4 text-center">
              The wallet you attempted to link to Mataxi is not currently on the
              Stellar Protocol.
            </p>
            <Link
              to="/signup"
              className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
            >
              Create an account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWallet;
