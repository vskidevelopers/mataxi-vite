import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
import {
  useProfileFunctions,
  useRoutesAndBookingFuntions,
} from "../firebase/firebase";
import { authUser } from "../firebase/firebase";
import { useBenkikoApiDepositWithdrawOperations } from "../benkiko/apiOperations";
import { useAuthUserDataFunctions } from "../auth/AuthStateManager";
export default function BookTripCheckOut() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [tripDetails, setTripDetails] = useState(null);
  const [paymentLoading, setPayementLoading] = useState(false);
  const {
    fetchTripDetails,
    addTransactionToFirestore,
    updateBookingPaidStatus,
    updateSeatNumberBooking,
  } = useRoutesAndBookingFuntions();
  const { fetchDriverUserInfo, fetchRiderUserInfo } = useProfileFunctions();
  const userType = useParams();
  const { generateAccessToken } = useAuthUserDataFunctions();
  const { handlePayment } = useBenkikoApiDepositWithdrawOperations();
  let [showTripHistoryRedirectModal, setShowTripHistoryRedirectModal] =
    useState(false);

  function closeTripHistoryRedirectModal() {
    setShowTripHistoryRedirectModal(false);
  }

  function openTripHistoryRedirectModal() {
    setShowTripHistoryRedirectModal(true);
  }

  const handleTicketSubmit = async () => {
    // Fetch trip details using the ticket number
    try {
      const tripDetailsResponse = await fetchTripDetails(ticketNumber);
      console.log("tripDetailsResponse >> ", tripDetailsResponse);
      setTripDetails(tripDetailsResponse?.data); // Assuming response.data contains trip details
    } catch (error) {
      console.error("Error fetching trip details:", error);
      // Handle error, display a message to the user, etc.
    }
  };

  const fetchTicketNumber = () => {
    let latestTicketIndex = 0;

    // Find the latest ticket index in local storage
    while (localStorage.getItem(`ticket ${latestTicketIndex}`)) {
      latestTicketIndex++;
    }

    // Retrieve the ticket number from local storage
    const latestTicketNumber = localStorage.getItem(
      `ticket ${latestTicketIndex - 1}`
    );

    // Perform any action with the fetched ticket number, such as displaying it
    console.log("Fetched Ticket Number:", latestTicketNumber);
    setTicketNumber(latestTicketNumber);
  };

  const handlePayNow = async () => {
    setPayementLoading(true);
    console.log("authUser?.currentUser.uid >> ", authUser?.currentUser?.uid);

    // Implement your payment logic here
    // This function will be called when the user clicks "Pay Now"
    const driverData = await fetchDriverUserInfo(tripDetails?.driverUid);
    const riderData = await fetchRiderUserInfo(authUser?.currentUser?.uid);
    console.log("riderData from checkout >> ", riderData);
    console.log("driverData from checkout >> ", driverData);

    const paymentRequestBody = {
      destination: driverData?.data?.publicKey,
      asset_code: "XLM",
      amount: tripDetails.price,
      text_memo: "transaction successfull",
      secret_key: riderData?.data?.secret_key,
      home_domain: "benkiko.io",
    };
    // setTokenLoading(false);
    console.log("Generating access token ...");
    const accessToken = await generateAccessToken();

    try {
      if (accessToken && riderData) {
        console.log("accessToken obtined >>", accessToken);
        console.log("data to use to handle payment >> ", paymentRequestBody);
        const handlePaymentResponse = await handlePayment(
          paymentRequestBody,
          accessToken
        );
        console.log("handlePaymentResponse >>", handlePaymentResponse);
        if (handlePaymentResponse?.success) {
          alert("Your Payment is Successful! Trip booked successfully.");
          // save Transaction Hash to firebase
          // display Modal navigating/redirecting user to tripHistory
          const transactionData = {
            riderUid: authUser?.currentUser?.uid,
            driverUid: tripDetails.driverUid,
            createdAt: new Date().toISOString(),
            status: "completed",
            ticketNumber: ticketNumber,
            transactionHash: handlePaymentResponse?.data?.data?.payment[
              "Transaction Hash"
            ]
              ? handlePaymentResponse?.data?.data?.payment["Transaction Hash"]
              : "error hash",
          };

          const addTransactionToFirestoreResponse =
            await addTransactionToFirestore(transactionData);
          console.log(
            "addTransactionToFirestoreResponse >> ",
            addTransactionToFirestoreResponse
          );

          if (addTransactionToFirestoreResponse?.success) {
            const updatePaidStatusRes = await updateBookingPaidStatus(
              ticketNumber
            );
            console.log("updatePaidStatusRes  >> ", updatePaidStatusRes);
            if (updatePaidStatusRes?.success) {
              const updateSeatNumberBookingRes = await updateSeatNumberBooking(
                tripDetails
              );
              console.log(
                "updateSeatNumberBookingRes >> ",
                updateSeatNumberBookingRes
              );
            }
            setPayementLoading(false);
            openTripHistoryRedirectModal();
          }
        } else {
          console.log(
            "couldn't make the payments. error : ",
            handlePaymentResponse?.error
          );
          setPayementLoading(false);
        }
      }
    } catch (error) {
      console.log("error occurred during pay now >> ", error);
      alert("an error occured while making payments. try again later");
    }
  };

  return (
    <div className="inset-0 flex justify-center z-20">
      <div className="max-w-xl mx-auto p-6">
        <Transition appear show={showTripHistoryRedirectModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 "
            onClose={closeTripHistoryRedirectModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex h-screen items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-md transition-all">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeTripHistoryRedirectModal}
                        className="text-gray-600 hover:text-[#F66C3E] focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-[#F66E3C]"
                    >
                      You have successfully Paid for your Trip
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Before you book your trip, please log in or create a new
                        account.Once you're logged in, you can connect your
                        Benkiko wallet to make payments.
                      </p>
                    </div>

                    <div className="mt-4 w-full flex justify-around items-center">
                      <div className="flex justify-between  items-center py-5">
                        <Link
                          to="/home"
                          className="mr-2 rounded-md border border-transparent bg-[#F66E3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff4806] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Back to home
                        </Link>

                        <Link
                          to={`/settings/${userType.user}/trip-history`}
                          className="rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Proceed to see Trip History
                        </Link>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <h2 className="text-2xl font-bold mb-4">Book Trip Checkout</h2>

        {/* Ticket input section */}
        <div className="mb-4">
          <label
            htmlFor="ticketNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your booking ticket number:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="ticketNumber"
              name="ticketNumber"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {!tripDetails && (
              <button
                onClick={fetchTicketNumber}
                className="bg-blue-500 text-white px-4 py-1 rounded-md"
                disabled={ticketNumber}
              >
                Fetch Trip Ticket Number
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          {!tripDetails || tripDetails ? (
            <button
              onClick={handleTicketSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              disabled={tripDetails}
            >
              Fetch Trip Details
            </button>
          ) : (
            <button
              onClick={handleTicketSubmit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Fetch Trip Details Buuton
            </button>
          )}
        </div>

        {/* Display trip details */}
        {tripDetails && (
          <div className="grid grid-cols-2 gap-4">
            <p className="font-bold">Destination:</p>
            <p>{tripDetails.to}</p>

            <p className="font-bold">Pickup Point:</p>
            <p>{tripDetails.from}</p>

            <p className="font-bold">Mode of Transport:</p>
            <p>{tripDetails.transport}</p>

            <p className="font-bold">Date:</p>
            <p>{tripDetails.date}</p>

            <p className="font-bold">Time:</p>
            <p>{tripDetails.time}</p>

            <p className="font-bold">Ride Type:</p>
            <p>{tripDetails.rideType}</p>

            <p className="font-bold">Selected Seats:</p>
            <p>{tripDetails.selectedSeats.join(", ")}</p>

            <p className="font-bold">Vehicle Number Plate:</p>
            <p>{tripDetails.vehicleNumberPlate}</p>

            <p className="font-bold">Total Price:</p>
            <p>Ksh {tripDetails.price}</p>
          </div>
        )}

        {/* Payment button */}
        {tripDetails && (
          <div className="mt-8">
            <button
              disabled={tripDetails.paid}
              onClick={handlePayNow}
              className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                paymentLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {paymentLoading && (
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    className="my-2 w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="ml-2 text-white font-semibold">
                    Loading...
                  </span>
                </div>
              )}
              {!paymentLoading && "Pay Now"}
            </button>
          </div>
        )}

        <div>
          <p className="text-md text-center mt-4">
            See your{" "}
            <Link to={`/settings/${userType.user}/trip-history`}>
              <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
                Trip History
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
