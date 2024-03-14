import React from "react";
import { Link } from "react-router-dom";
export default function AuthRedirectManager({ func }) {
  console.log("func >>", func);
  return (
    <div className="container mx-auto px-40">
      <div className="w-full h-screen flex justify-center items-center">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <h1 className="text-center">
              Welcome to Mataxi! Are you{" "}
              {func === "login" ? "signing in" : "signing up"} as a rider or a
              driver today? Please select one of the following options
            </h1>
          </div>
          <div className="flex w-full items-center justify-center gap-8">
            <Link
              to={`/${func}/rider`}
              className="bg-white shadow-lg py-3 px-6 font-medium text-[#F66E3C]
              "
            >
              {" "}
              Rider
            </Link>
            <Link
              to={
                func === "signup" ? `/${func}/driver/sacco` : `/${func}/driver/`
              }
              className="bg-white shadow-lg py-3 px-6 font-medium text-[#F66E3C]"
            >
              Driver
            </Link>
          </div>

          <div className="mt-28">
            <h2 className="text-center text-gray-500">
              If you're a passenger looking to book a ride, please select option
              1. If you're a driver looking to register your vehicle and start
              earning, please select option 2. Thank you for choosing Mataxi
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
