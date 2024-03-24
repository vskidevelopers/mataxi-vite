export const useBenkikoApiDepositWithdrawOperations = () => {
  const handleDeposit = async (assetData, secret_key, accessToken) => {
    console.log("data at handle deposit () >> ", assetData);
    const anchors = {
      clickpesa: "connect.clickpesa.com",
      ultrastellar: "ultrastellar.com",
      anclap: "api.anclap.com",
    };
    const url = `https://staging.api.benkiko.io/v1/transactions/deposit/interactive?asset_code=${
      assetData?.code
    }&secret_key=${secret_key}&domain=${anchors[assetData?.domain]}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken?.data?.data?.token}`,
        },
      });
      console.log("token >> ", accessToken.data.data.token);
      console.log("assetData.code >> ", assetData?.code);
      console.log("assetData.domain >> ", anchors[assetData.domain]);
      console.log("secret key >> ", secret_key);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // } else {
      //   console.log(`HTTP SUCCESS REQUEST! Status: ${response.status}`);
      // }

      if (response) {
        console.log("fetch response >> ", response);
      }

      const responseData = await response.json();
      console.log(JSON.stringify(responseData));
      return { success: true, data: responseData };
    } catch (error) {
      console.error("Fetch error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleWithdraw = async (assetData, secret_key, accessToken) => {
    console.log("data at handlewithdraw() >> ", assetData);
    const anchors = {
      clickpesa: "connect.clickpesa.com",
      ultrastellar: "ultrastellar.com",
      anclap: "api.anclap.com",
    };
    const url = `https://staging.api.benkiko.io/v1/transactions/withdraw/interactive?asset_code=${
      assetData?.code
    }&secret_key=${secret_key}&domain=${anchors[assetData?.domain]}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken?.data?.data?.token}`,
        },
      });
      console.log("token >> ", accessToken.data.data.token);
      console.log("assetData.code >> ", assetData?.code);
      console.log("assetData.domain >> ", anchors[assetData.domain]);
      console.log("secret key >> ", secret_key);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // } else {
      //   console.log(`HTTP SUCCESS REQUEST! Status: ${response.status}`);
      // }

      if (response) {
        console.log("fetch response >> ", response);
      }

      const responseData = await response.json();
      console.log(JSON.stringify(responseData));
      return { success: true, data: responseData };
    } catch (error) {
      console.error("Fetch error:", error);
      return { success: false, error: error.message };
    }
  };

  const handlePayment = async (data, accessToken) => {
    const url = "https://staging.api.benkiko.io/v1/payment";
    console.log(
      "ACCESS TOKEN TO USE FOR PAYMENT >> ",
      accessToken?.data?.data?.token
    );
    const stringifiedData = JSON.stringify(data);
    console.log("stringifiedData >> ", stringifiedData);
    const response = await fetch(url, {
      method: "post",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        // "access-control-allow-origin": "*",
        Authorization: `Bearer ${accessToken?.data?.data?.token}`,
      },
      body: stringifiedData,
    });

    try {
      const responseData = await response.json();
      console.log("payment api response >> ", response);
      console.log("payment api response.JSON() >> ", responseData);
      if (responseData?.code !== 201) {
        throw new Error(`HTTP error Status: ${responseData?.message}`);
      } else {
        console.log(`HTTP SUCCESS REQUEST Status: ${responseData?.status}`);

        console.log("Payment responseData >> ", responseData);
        return {
          success: true,
          message: "Successfully created payment.",
          data: responseData,
        };
      }
    } catch (error) {
      console.error("Error in Payment :", error);
    }
  };

  return { handleDeposit, handleWithdraw, handlePayment };
};