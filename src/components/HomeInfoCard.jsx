import React from "react";
import { Link } from "react-router-dom";

export default function HomeInfoCard({ data }) {
  return (
    <div className="w-full h-full bg-white rounded-md shadow-sm py-3 px-4">
      <div className=" grid grid-cols-1 gap-6 place-items-center ">
        <h1 className="font-bold text-xl text-[#F66E3C]">{data.title}</h1>
        <p className="text-sm text-gray-600 text-center">{data.content}</p>
        <Link to={data.link} className="py-3 px-4 bg-slate-500 rounded-md">
          {" "}
          {data.button}
        </Link>
      </div>
    </div>
  );
}
