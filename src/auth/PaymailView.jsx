import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBenkikoApiDepositWithdrawOperations } from "../benkiko/apiOperations";
import { useAuthUserDataFunctions } from "./AuthStateManager";

const PaymailView = async ({ userData }) => {
  const [accessToken, setAccessToken] = useState(null);
  const { generateAccessToken } = useAuthUserDataFunctions();
  const { getBenkikoBal } = useBenkikoApiDepositWithdrawOperations();
  // generate access token
  const getAccount = async () => {
    const accessTokenRes = await generateAccessToken();
    const accessTokenData = accessTokenRes?.data?.data?.token;
    console.log("access Token generated >> ", accessTokenData);
    setAccessToken(accessTokenData);

    if (accessTokenData) {
      const accountBal = await getBenkikoBal(
        accessTokenData,
        userData?.public_key
      );
      console.log("accountBal >> ", accountBal);
    } else {
      console.log("no access Token");
    }
  };

  const userType = useParams();
  console.log("userData from PaymailView >> ", userData);
  console.log("accessToken from PaymailView >> ", accessToken);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-xl">
      <div className=" w-full">
        <h3 className="text-[#F66E3C] text-xl font-bold text-center mb-3">
          {" "}
          PAYMAIL VIEW
        </h3>

        <p className="text-center">
          <span className="font-bold">Paymail :</span>
        </p>

        <div>
          <p className="text-center">
            <span className="font-bold">Benkiko Bal :</span>
          </p>
          <button
            onClick={getAccount}
            className="rounded bg-red-700 py-2 px-4 text-white hover:bg-red-900 focus:outline-none"
          >
            Get Account Info{" "}
          </button>
        </div>

        <br />
        <Link
          to={`/settings/${userType?.user}/settings`}
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
        >
          Return to Settings
        </Link>
      </div>
    </div>
  );
};

export default PaymailView;
