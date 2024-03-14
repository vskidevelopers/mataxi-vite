import React from "react";
import { Link, useParams } from "react-router-dom";

function PaymailView({ userData }) {
  const userType = useParams();
  console.log("userData from PaymailView >> ", userData);
  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-xl">
      <div className=" w-full">
        <h3 className="text-[#F66E3C] text-xl font-bold text-center mb-3">
          {" "}
          PAYMAIL VIEW
        </h3>

        <p className="text-center">
          <span className="font-bold">Paymail :</span> {userData?.paymail}
        </p>

        <br />
        <Link
          to={`/settings/${userType.user}/settings`}
          className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] block text-center"
        >
          Return to Settings
        </Link>
      </div>
    </div>
  );
}

export default PaymailView;
