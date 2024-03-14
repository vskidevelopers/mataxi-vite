import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { assets } from "../Utils/MataxiUtilsData";
import { useAuthUserDataFunctions } from "../auth/AuthStateManager";
import { useBenkikoApiDepositWithdrawOperations } from "../benkiko/apiOperations";
import { authUser, useProfileFunctions } from "../firebase/firebase";

function DepositFund() {
  const userType = useParams();
  const [loggedUser, setLoggedUser] = React.useState(authUser);
  const [riderUserData, setRiderUserData] = React.useState({});
  const [driverUserData, setDriverUserData] = React.useState({});
  const [secretKey, setSecretKey] = useState("");
  const { fetchRiderUserInfo, fetchDriverUserInfo } = useProfileFunctions();
  console.log("cuurent user >>", authUser?.currentUser?.uid);
  const getUserDetails = async () => {
    if (userType.user === "Rider") {
      const riderDetailsResponse = await fetchRiderUserInfo(
        loggedUser?.currentUser?.uid
      );
      setRiderUserData(riderDetailsResponse.data);
      setSecretKey(riderDetailsResponse.data.secret_key);
      console.log("riderDetailResponse >>", riderDetailsResponse);
    } else {
      const driverDetailsResponse = await fetchDriverUserInfo(
        loggedUser?.currentUser?.uid
      );
      setDriverUserData(driverDetailsResponse.data);
      setSecretKey(driverDetailsResponse.data.secret_key);
      console.log("driverDetailsResponse >>", driverDetailsResponse);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const { handleDeposit } = useBenkikoApiDepositWithdrawOperations();
  const { generateAccessToken } = useAuthUserDataFunctions();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDepositOnClick = async () => {
    console.log("Selected Asset >> ", selectedAsset);
    try {
      setTokenLoading(false);
      console.log("Generating access token ...");
      const accessToken = await generateAccessToken();

      if (accessToken) {
        console.log("accessToken obtined >>", accessToken);
        const handleDepositResponse = await handleDeposit(
          selectedAsset,
          secretKey,
          accessToken
        );
        console.log("handleDepositResponse >>", handleDepositResponse);
        const depositUrl = handleDepositResponse.data.data.url;

        window.open(depositUrl, "_blank");
      }
    } catch (error) {
      console.log("Error in depositing asset >>>", error);
      throw error;
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-xl">
      <div className=" w-full">
        <h3 className="text-[#F66E3C] text-xl font-bold text-center mb-3">
          Deposit Fund
        </h3>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-600">Top up your wallet with ease.</p>
        <div className="mr-3 flex space-x-4">
          <Link
            to="/settings"
            className="bg-gray-300 px-4 py-2 rounded border border-[#254E70] font-bold text-[#254E70] hover:bg-[#254E70] hover:text-white"
          >
            Back
          </Link>
          <Link
            to={`/settings/${userType.user}/wallet/withdraw`}
            className="bg-gray-300 px-4 py-2 rounded border border-[#254E70] font-bold text-[#254E70] hover:bg-[#254E70] hover:text-white"
          >
            Withdraw Funds
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">
          Select the asset type you want to Deposit
        </label>
        <div className="flex items-center">
          <select
            className="w-32 p-2 border rounded-l focus:outline-none"
            onChange={(e) =>
              handleAssetSelect(assets.find((a) => a.code === e.target.value))
            }
            value={selectedAsset ? selectedAsset.code : ""}
          >
            <option value="" disabled>
              Select Asset
            </option>
            {assets.map((asset) => (
              <option key={asset.code} value={asset.code}>
                {asset.code}
              </option>
            ))}
          </select>
          {selectedAsset && (
            <div className="flex items-center bg-gray-100 border border-l-0 rounded-r p-2 ml-1">
              <>
                <img
                  src={selectedAsset.icon}
                  alt={`${selectedAsset.code} icon`}
                  className="h-6 w-6 mr-2"
                />
                {selectedAsset.fullName}
              </>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex w-full justify-around">
        <button
          onClick={handleDepositOnClick}
          className="bg-[#828282] text-white w-1/3 px-4 py-2 rounded hover:bg-[#f66e3c]"
        >
          Deposit
        </button>
        <button className="border rounded border-[#828282] px-4 py-2 ml-2  w-1/3">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DepositFund;
