import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline"; // Import necessary icons
import { authUser, useProfileFunctions } from "../firebase/firebase";
const Settings = () => {
  const userType = useParams();

  const [loggedUser, setLoggedUser] = React.useState(authUser);
  const [riderUserData, setRiderUserData] = React.useState({});
  const [driverUserData, setDriverUserData] = React.useState({});
  const { fetchRiderUserInfo, fetchDriverUserInfo } = useProfileFunctions();
  console.log("cuurent user >>", authUser?.currentUser?.uid);
  const getUserDetails = async () => {
    if (userType.user === "Rider") {
      const riderDetailsResponse = await fetchRiderUserInfo(
        loggedUser?.currentUser?.uid
      );
      setRiderUserData(riderDetailsResponse.data);
      console.log("riderDetailResponse >>", riderDetailsResponse);
    } else {
      const driverDetailsResponse = await fetchDriverUserInfo(
        loggedUser?.currentUser?.uid
      );
      setDriverUserData(driverDetailsResponse.data);
      console.log("driverDetailsResponse >>", driverDetailsResponse);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="inset-0 flex justify-center z-20">
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-xl">
        {/* Profile Section */}
        <div className="text-center">
          <div className=" mb-3 flex justify-center">
            <div className="relative">
              <img
                src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" // Replace with the actual path to the image
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div
                className="absolute bottom-0 -right-5
            "
              >
                <PencilIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>
          <p className="font-bold text-lg">
            {userType.user === "Rider"
              ? riderUserData.name
              : driverUserData.driverUsername}
          </p>
          <p className="text-gray-500">
            {userType.user === "Rider"
              ? riderUserData.email
              : driverUserData.email}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="mt-8 space-y-4">
          <Link
            to={
              userType.user === "Rider"
                ? "profile"
                : `/accounts/${userType.user}/profile`
            }
            className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between"
          >
            Edit Profile
            <PencilIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <Link
            to="paymail"
            className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between"
          >
            Paymail
            {/* Add relevant icon */}
          </Link>
          <button className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between">
            Trip History
            {/* Add relevant icon */}
          </button>
          <button className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between">
            Notification
            {/* Add relevant icon */}
          </button>
          <button className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between">
            Account
            {/* Add relevant icon */}
          </button>
          <button className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between">
            Help
            {/* Add relevant icon */}
          </button>
          <button className="bg-gray-100 p-3 hover:bg-gray-200 w-full flex items-center justify-between">
            Support
            {/* Add relevant icon */}
          </button>
        </div>

        {/* Logout Section */}
        <div className="mt-8">
          <button className="bg-[#F66E3C] text-white p-3 hover:bg-red-500 w-1/3 text-center">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
