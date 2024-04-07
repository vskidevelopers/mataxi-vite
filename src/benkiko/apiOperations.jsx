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

      if (responseData?.code === 201) {
        console.log(`HTTP SUCCESS REQUEST Status: ${responseData?.status}`);
        console.log("Payment responseData >> ", responseData);
        return {
          success: true,
          message: "Successfully created payment.",
          data: responseData,
        };
      } else if (responseData?.code === 400) {
        throw new Error(`Bad request: ${responseData?.message}`);
      } else if (responseData?.code === 401) {
        throw new Error(`Authentication failed: ${responseData?.data?.error}`);
      } else if (responseData?.code === 404) {
        throw new Error(`Not found: ${responseData?.data?.error}`);
      } else if (responseData?.code === 422) {
        throw new Error(`Validation failed: ${responseData?.data?.error}`);
      } else {
        throw new Error(`HTTP error Status: ${responseData?.message}`);
      }
    } catch (error) {
      console.error("Error in Payment:", error);
      return {
        success: false,
        message: "Error creating payment.",
        error: error.message,
      };
    }
  };

  const getBenkikoBal = async (accessToken, account_id) => {
    const url = `https://staging.api.benkiko.io/v1/account-info?account_id=${account_id}`;
    console.log(
      `params received for getBenkikoBal() >> accessToken = ${accessToken} || account_id = ${account_id}`
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response) {
        console.log("fetch response >> ", response);
      }

      const responseData = await response.json();
      console.log("responseData >> ", responseData);
      const bal = responseData?.data?.balances?.[0]?.balance;
      const formattedBalance = parseFloat(bal).toFixed(2);
      return { success: true, data: formattedBalance };
    } catch (error) {
      console.error("Fetch error:", error);
      return { success: false, error: error.message };
    }
  };

  return { handleDeposit, handleWithdraw, handlePayment, getBenkikoBal };
};
