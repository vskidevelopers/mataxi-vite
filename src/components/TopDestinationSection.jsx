import React from "react";
import TopDestinationCard from "./TopDestinationCard";
import { topDestionationData } from "../Utils/MataxiUtilsData";

export default function TopDestinationSection() {
  return (
    <div className="w-full px-10 bg-white rounded-xl shadow-md">
      <div className="container mx-auto my-5 py-5">
        <div className="grid grid-cols-1 gap-3">
          {/* Title */}
          <div className="my-5 flex justify-center items-center">
            <h1 className="text-4xl font-extrabold text-[#F66E3C]">
              Top Destination
            </h1>
          </div>
          {/* Content */}
          <div className="mb-4">
            <p className="text-center text-gray-700">
              Discover the best places to go with Mataxi! Our top destinations
              feature the most popular and exciting places that our travelers
              love to visit. From vibrant cities to scenic spots, we've got you
              covered.
            </p>
          </div>
          {/* Destination cards */}
          <div>
            <div className="grid grid-cols-1 gap-3">
              {/* Row 1 */}
              <div className="w-full flex gap-5">
                <div className="basis-3/5">
                  <TopDestinationCard data={topDestionationData[0]} />
                </div>
                <div className="basis-2/5">
                  <TopDestinationCard data={topDestionationData[1]} />
                </div>
              </div>
              {/* Row 2 */}
              <div className="w-full flex gap-7">
                <div className="basis-2/3">
                  <TopDestinationCard data={topDestionationData[2]} />
                </div>
                <div className="basis-1/3">
                  <TopDestinationCard data={topDestionationData[3]} />
                </div>
              </div>
              {/* Row 1 */}
              <div className="w-full flex gap-7">
                <div className="basis-2/5">
                  <TopDestinationCard data={topDestionationData[4]} />
                </div>
                <div className="basis-3/5">
                  <TopDestinationCard data={topDestionationData[5]} />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center  my-10">
              <div className="basis-1/3">
                {" "}
                <button className="w-full py-2 px-6 bg-[#f66E3C] rounded-md">
                  Explore more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
