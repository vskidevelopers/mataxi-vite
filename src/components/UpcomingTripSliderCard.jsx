import React from "react";
import curvedline from "../assets/images/curvedLine.png";

export default function UpcomingTripSliderCard() {
  return (
    <div className="relative w-[380px] sm:w-[400px] xl:w-[560px]  rounded-xl grid grid-cols-1 gap-3 bg-[#7A9E9C] py-10 px-5">
      {/* Add the top triangle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 15,30 30,0" fill="#fff" />
        </svg>
      </div>

      <div className="py-3 flex w-full">
        <div className="basis-1/4 flex flex-col gap-2">
          <h3 className="text-sm ">from</h3>
          <h1 className="text-md font-bold">Nairobi</h1>
        </div>
        <div className="basis-1/2 flex relative ">
          <div className="h-1/2">
            <img src={curvedline} alt="" className="w-full" />
          </div>
        </div>
        <div className="basis-1/4 flex flex-col gap-2 items-end">
          <h3 className="text-sm ">to</h3>
          <h1 className="text-md font-bold">Malindi</h1>
        </div>
      </div>

      <div className="py-3 flex justify-between">
        <div className="basis-1/4 flex flex-col gap-2">
          <h3 className="text-sm ">Date</h3>
          <h1 className="text-md font-bold">March, 10</h1>
        </div>
        <div className="basis-1/2 flex relative w-1/2 right-5"></div>
        <div className="basis-1/4 flex flex-col gap-2 items-end">
          <h3 className="text-sm ">Time</h3>
          <h1 className="text-md font-bold">8:00 am</h1>
        </div>
      </div>

      <div className="py-3 flex justify-between">
        <div className="basis-1/4 flex flex-col gap-2">
          <h3 className="text-sm ">Available seat</h3>
          <h1 className="text-md font-bold">4</h1>
        </div>
        <div className="basis-1/2 flex relative w-1/2 right-5"></div>
        <div className="basis-1/4 flex flex-col gap-2 items-end">
          <h3 className="text-sm ">Price </h3>
          <h1 className="text-md font-bold">KSH 1,500</h1>
        </div>
      </div>

      {/* Add the bottom triangle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,30 15,0 30,30" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}
