import { Link, useParams } from "react-router-dom";
import { useAuthUserDataFunctions } from "./AuthStateManager";
import { useBenkikoApiDepositWithdrawOperations } from "../benkiko/apiOperations";
import { useState } from "react";

export default function PaymailScreen({ userData }) {
  const [demoBal, setDemoBal] = useState(0);
  const userType = useParams();
  const { generateAccessToken } = useAuthUserDataFunctions();
  const { getBenkikoBal } = useBenkikoApiDepositWithdrawOperations();

  const getAccount = async () => {
    console.log("clicked check bal");
    console.log("userData >> ", userData);
    try {
      const accessTokenRes = await generateAccessToken();
      const accessTokenData = accessTokenRes?.data?.data?.token;
      console.log("access Token generated >> ", accessTokenData);
      if (accessTokenData) {
        const accountBal = await getBenkikoBal(
          accessTokenData,
          userData?.public_key
        );
        console.log("accountBal >> ", accountBal);
        setDemoBal(accountBal?.data);
      } else {
        console.log("no access Token");
      }
    } catch (error) {
      console.log("caught error >> ", error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-xl">
      <div className=" w-full">
        <h3 className="text-[#F66E3C] text-xl font-bold text-center mb-3">
          {" "}
          PAYMAIL VIEW
        </h3>

        <p className="text-center">
          <span className="font-bold">Paymail :</span>
          {userData ? userData.paymail : "no user data loaded"}
        </p>

        <div className="flex justify-around">
          <p className="text-center">
            <span className="font-bold">Benkiko Bal : </span>
            {demoBal} <span className="font-bold"> XLM</span>
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
}
