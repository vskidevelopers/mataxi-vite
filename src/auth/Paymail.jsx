import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../Utils/MataxiUtilsData";
import { authUser, useProfileFunctions } from "../firebase/firebase";
import CreatePaymail from "./CreatePaymail";
import PaymailView from "./PaymailView";

function Paymail() {
  const { fetchDriverUserInfo, fetchRiderUserInfo } = useProfileFunctions();
  const [userData, setUserData] = useState(null);
  const userType = useParams();
  const userUid = authUser?.currentUser?.uid;

  let mataxiUserInfo;

  const fetchUserData = async () => {
    if (userType.user === "Rider") {
      mataxiUserInfo = await fetchRiderUserInfo(userUid);
      setUserData(mataxiUserInfo);
    } else if (userType.user === "Driver") {
      mataxiUserInfo = await fetchDriverUserInfo(userUid);
      setUserData(mataxiUserInfo);
    }
  };

  useEffect(() => {
    const useEffectFetchUserData = async () => {
      await fetchUserData();
    };

    useEffectFetchUserData();
  }, []);

  console.log("userData in Paymail >> ", userData);
  console.log("mataxiUserInfo >> ", mataxiUserInfo);

  if (userData?.data?.paymail) {
    return <PaymailView userData={userData?.data} />;
  } else {
    return <CreatePaymail userDetails={userData?.data} />;
  }
}

export default Paymail;
