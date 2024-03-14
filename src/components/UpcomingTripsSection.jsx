import React from "react";
import UpcomingTripSliderCard from "./UpcomingTripSliderCard";
import UpcomingTripSlider from "./UpcomingTripSlider";

export default function UpcomingTripsSection() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div>
        <h1 className="text-xl text-center font-bold text-[#F66E3C] my-2">
          Upcoming trips
        </h1>
      </div>
      <div className="my-2">
        <h3 className="text-md font-semibold text-center text-gray-900">
          Check out some of our upcoming trips and start planning your next
          adventure with Mataxi!
        </h3>
      </div>
      {/* Slider */}
      <div className="my-4">
        {/* <UpcomingTripSliderCard />
        <UpcomingTripSliderCard /> */}
        <UpcomingTripSlider />
      </div>
      <div className="flex justify-center gap-9 w-full my-7 ">
        <button className="rounded-lg py-3 px-6 bg-[#F66E3C] hover:bg-[#f73e00]">
          Plan Your Trip
        </button>
        <button className="rounded-lg py-3 px-6 text-[#F66C3E] font-medium hover:text-white border border-[#F66E3C] hover:bg-[#F66E3C] ">
          View all
        </button>
      </div>
    </div>
  );
}
