import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { authUser, useProfileFunctions } from "../firebase/firebase";
import CreatePaymail from "./CreatePaymail";

import PaymailScreen from "./PaymailScreen";

function Paymail() {
  const { fetchDriverUserInfo, fetchRiderUserInfo } = useProfileFunctions();
  const [userData, setUserData] = useState(null);
  const userType = useParams();
  const userUid = authUser?.currentUser?.uid;

  let mataxiUserInfo;

  const fetchUserData = async () => {
    console.log("fetching user data ...");
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

  if (userType.user === "Rider") {
    return <PaymailScreen userData={userData?.data} />;
  } else if (userData?.data?.paymail) {
    return <PaymailScreen userData={userData?.data} />;
  } else {
    return <CreatePaymail userDetails={userData?.data} />;
  }
}

export default Paymail;
