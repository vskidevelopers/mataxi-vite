import { useEffect, useState } from "react";
import { driverUser, useProfileFunctions } from "../firebase/firebase";
// import "../setupEnv";

const baseUrl = "https://staging.api.benkiko.io";
const benkikoClientAccount =
  "GBSHFCR2W5ZIBP7PEAPTO55N7DKLLEBWP5RC4E3N52HNRNTUY4H57I7O";
const benkikoSigningSeed =
  "gAAAAABkVMaORVGtGG8qqALQAQLH2ClHQwWKE3-BXu8yDasN2PYBiv9yxz5WuZVDaOdTTGKdoQmwh7Pae8IfBYS9SZk1kc_rsBzUoqzbU2t0TR0W0P9nqmUWZo2CgFsnHdiw0xy-ZT18r62KmbeMvdmW4Vu6-ENvtA==";
const challangeUrl = `${baseUrl}/v1/auth/challenge`;
const signUrl = `${baseUrl}/v1/auth/sign`;
const tokenUrl = `${baseUrl}/v1/auth/token`;
const createUserUrl = `${baseUrl}/v1/account`;

export const useAuthUserDataFunctions = () => {
  const { fetchDriverUserInfo } = useProfileFunctions();
  const [mmemonics, setMmemonics] = useState(null);
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username")
      ? localStorage.getItem("username")
      : null,
    mmemonics: localStorage.getItem("mmemonics")
      ? localStorage.getItem("mmemonics")
      : null,
    index: 0,
    language: "ENGLISH",
    home_domain: "benkiko.io",
  });

  const generateMmemonics = async () => {
    const url = `${baseUrl}/v1/generate-mnemonic`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "ENGLISH",
          strength: 256,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const mmemonicsData = await response.json();
      // Handle the response data here
      console.log("mmemonics data >>", mmemonicsData);
      localStorage.setItem("mmemonics", mmemonicsData.data.mnemonic);
      saveMmemonics(mmemonicsData.data.mnemonic);
      setMmemonics(mmemonicsData.data.mnemonic);
      return mmemonicsData;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveMmemonics = (mnemonics) => {
    console.log("mmemonics to be saved >>", mnemonics);
    setUserData((prevState) => ({
      ...prevState,
      mmemonics: mnemonics, // Update the 'mmemonics' property with the new value
    }));
  };

  const getToken = async (clientAccount) => {
    const apiUrl = `${challangeUrl}?client_account=${clientAccount}&home_domain=benkiko.io`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to obtain JWT token");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obtaining JWT token:", error);
      throw error;
    }
  };

  const signChallenge = async (challengeTransactionXDR, signingSeed) => {
    console.log(
      "challengeTransactionXDR >>",
      challengeTransactionXDR.data.transaction
    );

    try {
      const response = await fetch(signUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge_transaction_xdr: challengeTransactionXDR.data.transaction,
          client_account_signing_seed: signingSeed,
        }),
      });

      if (!response.ok) {
        console.log("sign challenge response >>", response);
        throw new Error("Failed to sign challenge");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error signing challenge:", error);
      throw error;
    }
  };

  const getJWT = async (signedChallengeTransactionXDR) => {
    console.log(
      "signedChallengeTransactionXDR >>",
      signedChallengeTransactionXDR
    );

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signed_challenge_transaction_xdr:
            signedChallengeTransactionXDR.data.transaction,
        }),
      });

      if (!response.ok) {
        console.log("get jwt response >>", response);
        throw new Error("Failed to obtain JWT");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obtaining JWT:", error);
      throw error;
    }
  };

  const generateAccessToken = async () => {
    try {
      console.log("generateAccessToken init ...");
      const jwtTokenData = await getToken(benkikoClientAccount);
      const signData = await signChallenge(jwtTokenData, benkikoSigningSeed);
      const jwtData = await getJWT(signData);
      console.log("jwt data >> ", jwtData);
      return { success: true, data: jwtData }; // Return the JWT data
    } catch (error) {
      console.error("Error while getting JWT:", error);
      return null;
    }
  };

  const createUserTokens = async () => {
    try {
      // Get JWT token using generateAccessToken
      const jwtData = await generateAccessToken();
      console.log("Token Data >>", jwtData);

      // Check if jwtData is available
      if (!jwtData) {
        throw new Error("JWT token not available");
      }

      // Define the request body
      const requestBody = {
        username: userData.username,
        mnemonic: userData.mmemonics,
        index: 0,
        language: "ENGLISH",
        home_domain: "benkiko.io",
      };

      console.log("request Body <>>", requestBody);
      console.log("jwtData?.data?.token >> ", jwtData.data.data.token);

      // Make the API call to create the user
      if (jwtData) {
        const response = await fetch(createUserUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtData.data.data.token}`, // Use the JWT token as a bearer token
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.log("response from creating user acc >>", response);
          throw new Error("Failed to create user");
        } else {
          console.log("response from creating user acc >>", response);
        }

        // Handle the response data if needed
        const responseData = await response.json();
        localStorage.setItem("publicKey", responseData.data["public key"]);
        localStorage.setItem("secretKey", responseData.data["secret key"]);
        return responseData;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const createWalletAutomatically = async () => {
    const driverUid = driverUser.currentUser.uid;
    const driverData = await fetchDriverUserInfo(driverUid);
    const accessToken = await generateAccessToken();
    const mnemonics = await generateMmemonics();

    try {
      console.log("mnemonics >>", mnemonics);
      console.log("accessToken >>", accessToken);
      console.log("driverData >>", driverData);

      // Check if jwtData is available
      if (!accessToken) {
        throw new Error("JWT token not available");
      }

      function validateAndModifyUsername(username) {
        // Remove leading and trailing whitespaces
        username = username.trim();

        // Merge names if there is a space
        if (username.includes(" ")) {
          username = username.replace(/\s+/g, ""); // Remove spaces
        }

        // Remove underscores and capitalize preceding letter
        if (username.includes("_")) {
          username = username
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return username;
      }

      const modifiedUsername = validateAndModifyUsername(
        driverData?.data?.driverUsername
      );

      const requestBody = {
        username: modifiedUsername,
        mnemonic: mnemonics?.data?.mnemonic,
        index: 0,
        language: "ENGLISH",
        home_domain: "benkiko.io",
      };

      console.log("request Body <>>", requestBody);
      console.log("access Token >> ", accessToken.data.data.token);

      // Make the API call to create the user
      if (accessToken) {
        const response = await fetch(createUserUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.data.data.token}`, // Use the JWT token as a bearer token
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.log("response from creating user acc >>", response);
          throw new Error("Failed to create user");
        } else {
          console.log("response from creating user acc >>", response);
        }
        // Handle the response data if needed
        const responseData = await response.json();

        return { ...responseData, mnemonics: mnemonics.data.mnemonic };
      }
    } catch (error) {
      console.error(
        "error occured tryingto automatically generate a wallet >> ",
        error
      );
      throw new Error("Failed to auto generate a wallet >> ", error);
    }
  };

  return {
    userData,
    mmemonics,
    setUserData,
    createUserTokens,
    generateMmemonics,
    generateAccessToken,
    createWalletAutomatically,
  };
};
