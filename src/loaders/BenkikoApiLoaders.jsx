import { useAuthUserDataFunctions } from "../auth/AuthStateManager";

export const getAccessTokenLoader = async () => {
  const { generateAccessToken } = useAuthUserDataFunctions();
  try {
    const accessToken = await generateAccessToken();
    console.log("accessToken >> ", accessToken);
    return accessToken;
  } catch (error) {
    console.log("caught err >> ", error);
    return error;
  }
};
