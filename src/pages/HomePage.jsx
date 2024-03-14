import React from "react";
import backgroundImage from "../assets/images/background-map.png";
import HomeSearchBar from "../components/HomeSearchBar";
import HomeInfoCard from "../components/HomeInfoCard";
import { homeInfoCardsData } from "../Utils/MataxiUtilsData";

import UpcomingTripsSection from "../components/UpcomingTripsSection";
import PopularRoutesSection from "../components/PopularRoutesSection";
import TopDestinationSection from "../components/TopDestinationSection";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="h-full">
      <div className="relative">
        <div className="min-h-screen absolute inset-0 h-full w-full">
          <div className="absolute inset-0  bg-gray-200">
            {/* Placeholder Image */}
            <img
              src={backgroundImage}
              alt="Placeholder"
              className="w-full h-full object-cover object-center"
            />

            {/* Loading Spinner */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-gray-900"></div>
            </div> */}
          </div>

          <div className="absolute inset-0 h-full bg-[#181b1c]/25"></div>
        </div>
        <div className="absolute h-full w-full  text-white">
          <div className="h-full w-full mt-28  ">
            <div className="w-full container mx-auto px-10">
              <div className="flex flex-col gap-5 ">
                <HomeSearchBar />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                  {homeInfoCardsData.map((data, i) => (
                    <HomeInfoCard key={`card-${i}`} data={data} />
                  ))}
                </div>
                <div className="w-full py-8">
                  <UpcomingTripsSection />
                </div>

                <div>
                  <PopularRoutesSection />
                </div>

                <div>
                  <TopDestinationSection />
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
