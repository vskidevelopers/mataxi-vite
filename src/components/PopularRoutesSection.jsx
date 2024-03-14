import React from "react";
import PopularRoutesCards from "./PopularRoutesCards";

export default function PopularRoutesSection() {
  return (
    <div className="w-full px-10 bg-white rounded-xl shadow-md">
      <div className="container mx-auto my-5 py-5">
        <div className="grid grid-cols-1 gap-3">
          {/* Title */}
          <div className="my-5 flex justify-center items-center">
            <h1 className="text-2xl font-bold text-[#F66E3C]">
              Popular Routes
            </h1>
          </div>
          {/* Content */}
          <div className="mb-4">
            <p className="text-center text-gray-700">
              Explore our handpicked selection of city-to-city and inter-county
              commutes. Browse through schedules and compare prices to find the
              best option for you. Book your trip today and experience
              hassle-free travel with Mataxi.
            </p>
          </div>
          {/* Routes cards */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <PopularRoutesCards />
              <PopularRoutesCards />
              <PopularRoutesCards />
              <PopularRoutesCards />
              <PopularRoutesCards />
              <PopularRoutesCards />
            </div>
            <div className="flex w-full justify-center  my-10">
              <div className="basis-1/3">
                {" "}
                <button className="w-full py-2 px-6 bg-[#f66E3C] rounded-md">
                  Find Route
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
