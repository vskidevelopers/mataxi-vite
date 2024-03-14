import React from "react";

export default function TopDestinationCard({ data }) {
  return (
    <div className="group relative flex flex-col bg-black h-[380px] overflow-clip rounded-xl">
      <img
        alt="Developer"
        src={data.imageSrc}
        className="flex-grow-1 h-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />

      <div className="absolute top-5 left-5 p-4 sm:p-6 lg:p-8 flex-grow">
        <div className=" mt-60 ">
          <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xl font-bold text-[#F66E3C] sm:text-2xl">
              {data.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
