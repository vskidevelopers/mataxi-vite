import React from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BookTripSuccess() {
  const userType = useParams();
  return (
    <div className="inset-0 flex justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <div className="relative flex justify-center items-center space-x-4 mb-4">
          <div className="h-32 w-32 bg-[#FFCAB7] rounded-full flex justify-center items-center">
            <div className=" h-20 w-20 bg-[#FF8A5F] rounded-full flex justify-center items-center">
              <div className=" h-12 w-12 bg-[#F66E3C] rounded-full flex justify-center items-center">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-center text-md font-semibold mb-4 text-[#F66E3C]">
          Congratulations! Your booking has been confirmed
        </h1>
        <p className="text-gray-900 text-center  ">
          Thank you for choosing Mataxi for your transportation needs. We look
          forward to providing you with a safe and comfortable journey
        </p>
        <div className="flex items-center py-10 justify-around">
          <Link
            to={`/settings/${userType.user}/book-trip/checkout`}
            className="bg-green-800 text-white rounded-full py-2 px-4 mt-4  hover:bg-green-500 block text-center"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/home"
            className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4  hover:bg-[#f57859] block text-center"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
