import React from "react";
import { useParams, Link } from "react-router-dom";

export default function WelcomeScreen({ screensData }) {
  const { title } = useParams();
  console.log("title >>", title);
  // Find the object that matches the selected title
  const selectedScreen = screensData.find((screen) => screen.id === title);

  const backgroundImageStyle = {
    backgroundImage: `url(${selectedScreen.svgSrc})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  if (!selectedScreen) {
    // Handle the case where the selected title doesn't match any object
    return <div>Screen not found.</div>;
  }

  const WelcomeScreenModal = () => {
    return (
      <div className="flex items-center justify-center h-full w-full px-4 bg-white shadow-lg rounded-sm mt-20">
        <div className="grid grid-cols-1 gap-3">
          <div
            className="w-full h-[300px] bg-contain"
            style={backgroundImageStyle}
          ></div>
          <div className=" px-5 ">
            <div className="container mx-auto grid grid-cols-1 gap-3 py-2 " />
            <h1 className="text-xl font-bold text-[#F66E3C] text-center">
              {selectedScreen?.title}
            </h1>
            <div className="w-96">
              <p className="text-center">{selectedScreen.message}</p>
            </div>

            <div className="flex items-center py-6 gap-4">
              <Link
                to={selectedScreen.screenHref}
                className="basis-2/3 flex justify-center bg-[#F66E3C] hover:bg-[#eb490e] text-white font-semibold px-4 py-2 rounded-md"
              >
                {selectedScreen.screenTarget}
              </Link>
              <Link
                to={selectedScreen.nextHref}
                className="basis-1/3 flex justify-center border border-[#F66E3C] hover:bg-[#F66E3C] text-[#F66E3C] hover:text-white font-semibold px-4 py-2 rounded-md"
              >
                Next
              </Link>
            </div>
          </div>
        </div>

        {/* Add other content inside the modal */}
      </div>
    );
  };

  return (
    <div
      className=" h-screen overflow-hidden bg-cover"
      style={backgroundImageStyle}
    >
      <div className="h-full w-full absolute bg-gray-400/50"></div>
      <div className=" relative container mx-auto h-full flex justify-center items-center ">
        <div className="  w-max h-max">
          <div className="absolute inset-x-36 flex justify-between top-32 w-4/5">
            <Link
              to={selectedScreen.prevHref}
              className=" flex justify-center  text-2xl  text-slate-800 hover:text-black font-semibold px-4 py-2 rounded-md"
            >
              Back
            </Link>
            <Link
              to="/home"
              className=" flex justify-center  text-2xl text-slate-800 hover:text-black font-semibold px-4 py-2 rounded-md"
            >
              Skip
            </Link>
          </div>
          <WelcomeScreenModal />
        </div>
      </div>
    </div>
  );
}
