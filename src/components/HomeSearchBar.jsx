import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const HomeSearchBar = () => {
  return (
    <div className=" w-full  mx-auto p-4">
      <div className="relative rounded-full bg-white shadow-md">
        <input
          type="text"
          placeholder="Search for destinations..."
          className="block w-full rounded-full py-4 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
        />
        <div className="absolute inset-y-0 right-5 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default HomeSearchBar;
