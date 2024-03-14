import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function SettingsUi() {
  const user = localStorage.getItem("isDriver") ? "Driver" : "Rider";

  return (
    <div className="inset-0 flex items-center justify-center z-20 overflow-y-auto">
      <div className="w-full bg-white p-8 rounded-lg shadow-md max-w-xl mt-20">
        <div className="flex justify-between border-b mb-4 pb-2">
          <div className="space-x-6">
            {user === "Driver" ? (
              <Link
                to={`/settings/${user}/dashboard`}
                className="text-[#F66E3C] hover:text-[#F74909] font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to={`/settings/${user}/book-trip`}
                className="text-[#F66E3C] hover:text-[#F74909] font-semibold"
              >
                Book Your Trip
              </Link>
            )}
            <Link
              to={`/settings/${user}/wallet/deposit`}
              className="text-[#F66E3C] hover:text-[#F74909] font-semibold"
            >
              Wallet
            </Link>
            <Link
              to="#"
              className="text-[#F66E3C] hover:text-[#F74909] font-semibold"
            >
              Notifications
            </Link>
            <Link
              to={`/settings/${user}/settings`}
              className="text-[#F66E3C] hover:text-[#F74909] font-semibold"
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="mt-6">
          {/* Here goes the outlet based on the clicked link */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
