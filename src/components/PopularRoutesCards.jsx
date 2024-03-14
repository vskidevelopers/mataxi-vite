import React from "react";
import routeMap from "../assets/images/route.png";

export default function PopularRoutesCards() {
  return (
    <div className="border border-[#F66E3C] rounded-lg overflow-clip">
      <div className="block rounde">
        <img
          alt="Art"
          src={routeMap}
          className=" h-52 w-full object-cover sm:h-60"
        />

        <div className="grid grid-cols-1 gap-3 px-4">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="mt-1 text-sm   text-gray-900 sm:text-lg">Route</h3>
            </div>
            <div className="">
              <h3 className="mt-1 text-md font-semibold text-gray-900 sm:text-lg">
                Thika to Nairobi
              </h3>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="">
              <h3 className="mt-1 text-sm   text-gray-900 sm:text-lg">Price</h3>
            </div>
            <div className="">
              <h3 className="mt-1 text-md font-semibold text-gray-900 sm:text-lg">
                100 KES
              </h3>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="">
              <h3 className="mt-1 text-sm    text-gray-900 sm:text-lg">
                Schedule
              </h3>
            </div>
            <div className="">
              <h3 className="mt-1 text-md font-semibold text-gray-900 sm:text-lg">
                Every hour
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
