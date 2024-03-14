import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const SignUpComplete = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <div className="relative flex justify-center items-center space-x-4 mb-4">
          <div className="h-32 w-32 bg-[#FFCAB7] rounded-full flex justify-center items-center">
            <div className=" h-20 w-20 bg-[#FF8A5F] rounded-full flex justify-center items-center">
              <div className=" h-12 w-12 bg-[#F66E3C] rounded-full flex justify-center items-center">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-center font-bold text-xl">
          Account successfully created
        </p>
        <Link
          to="/login"
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpComplete;
