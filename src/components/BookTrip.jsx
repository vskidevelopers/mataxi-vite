import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useRoutesAndBookingFuntions } from "../firebase/firebase";
import { authUser } from "../firebase/firebase";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function BookTrip() {
  const { register, handleSubmit, watch, getValues } = useForm();
  const [selectedRideType, setSelectedRideType] = useState(null);
  const {
    approvedRoutes,
    mataxiStandard,
    mataxiLuxe,
    mataxiXl,
    getSelectedRoute,
    registerNewBooking,
    fetchAvailableVehicle,
    fetchSelectedAvailableVehicleData,
    addSelectedVehicleToBookingAllocationCollection,
  } = useRoutesAndBookingFuntions();

  const user = useParams();
  console.log("userr >> ", user);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState();
  const [selectedRoute, setSelectedRoute] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [showNoVehicleModal, setShowNoVehicleModal] = useState({
    show: false,
    message: null,
  });
  console.log("approved Routes from Bookings Trip >>", approvedRoutes);
  console.log("mataxi std >>", mataxiStandard);
  console.log("mataxi luxe >>", mataxiLuxe);
  console.log("mataxi xl >>", mataxiXl);
  const pickupPoints = approvedRoutes.map((item) => item.startPoint);
  const destinations = approvedRoutes.map((item) => item.endPoint);
  console.log("pickUpPoints >>", pickupPoints);
  console.log("destinations >>", destinations);
  console.log([...new Set(destinations)]);
  const destinationList = [...new Set(destinations)];
  const pickupPointList = [...new Set(pickupPoints)];
  let [isOpen, setIsOpen] = useState(false);
  let [showLoginRedirectModal, setShowLoginRedirectModal] = useState(false);
  let [showNoRoutesModal, setShowNoRoutesModal] = useState(false);
  let [bookingNumber, setBookingNumber] = useState();
  const navigate = useNavigate();

  const [selectedDestination, setSelectedDestination] = useState(
    destinations[0]
  );
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(
    pickupPoints[0]
  );
  const [query, setQuery] = useState("");

  const filteredDestinations =
    query === ""
      ? destinationList
      : destinationList.filter((location) =>
          location
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredPickupPoints =
    query === ""
      ? pickupPointList
      : pickupPointList.filter((location) =>
          location
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  function closeModal() {
    setIsOpen(false);
  }
  function closeNoRoutesModal() {
    setShowNoRoutesModal(false);
  }

  function closeLoginRedirectModal() {
    setShowLoginRedirectModal(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function openLoginRedirectModal() {
    setShowLoginRedirectModal(true);
  }

  const handleRadioChange = async (event) => {
    setRoutesLoading(true);
    setShowNoVehicleModal({
      show: false,
      message: null,
    });
    const selectedRideTypeValue = event?.target?.value;
    try {
      setSelectedRideType(selectedRideTypeValue);
      setSelectedSeats([]);
      console.log("selectedRideType >>", selectedRideTypeValue);
      await getVehicle(selectedRideTypeValue);
      const watchFrom = selectedPickupPoint;
      const watchTo = selectedDestination;

      // Call the function to get estimated price when 'from' or 'to' values change
      if (watchFrom && watchTo) {
        console.log(
          `watchFrom and watchTo exists! : ${watchFrom} and ${watchTo}`
        );
        getEstimatedPrice(watchFrom, watchTo);
      }
    } catch (error) {
      console.log("error at handleRadioChange >> ", error);
    }
    setRoutesLoading(false);
  };

  const handleSeatClick = (seatId, isSeatBooked) => {
    if (isSeatBooked) {
      alert("This seat is already booked. Please choose another seat.");
      return;
    }
    if (selectedSeats.includes(seatId)) {
      // Deselect the seat
      const newSelectedSeats = selectedSeats.filter((seat) => seat !== seatId);
      setSelectedSeats(newSelectedSeats);
      console.log("selectedSeats >> ", newSelectedSeats);
    } else {
      // Select the seat
      const newSelectedSeats = [...selectedSeats, seatId];
      setSelectedSeats(newSelectedSeats);
      console.log("selectedSeats >> ", newSelectedSeats);
    }
  };

  const getVehicle = async (selectedRideType) => {
    console.log("selected Ride Type from getVehicle () >>", selectedRideType);
    try {
      const fetchAvailableVehicleResponse = await fetchAvailableVehicle(
        selectedRideType
      );
      console.log(
        "fetchAvailableVehicleResponse >>",
        fetchAvailableVehicleResponse
      );
      if (fetchAvailableVehicleResponse?.success) {
        const fetchSelectedAvailableVehicleDataResponse =
          await fetchSelectedAvailableVehicleData(
            selectedRideType,
            fetchAvailableVehicleResponse?.data?.id
          );

        console.log(
          "fetchSelectedAvailableVehicleDataResponse  >> ",
          fetchSelectedAvailableVehicleDataResponse
        );

        if (fetchSelectedAvailableVehicleDataResponse?.success) {
          const selectedVehicleDetails =
            fetchSelectedAvailableVehicleDataResponse?.data;
          console.log("chosen vehicle >> ", selectedVehicleDetails);
          setVehicleDetails(selectedVehicleDetails);
        } else {
          console.log(
            "no vehicle found! We gon have to add this one to the list >> ",
            fetchSelectedAvailableVehicleDataResponse?.data
          );
          // proceed to add vehicle data to and fetch from Booking Allocation Collection.
          try {
            const addVehicleForBookingResponse =
              await addSelectedVehicleToBookingAllocationCollection(
                selectedRideType,
                fetchSelectedAvailableVehicleDataResponse?.data
              );
            console.log(
              "addVehicleForBookingResponse >> ",
              addVehicleForBookingResponse
            );
            if (addVehicleForBookingResponse?.success) {
              console.log(
                "addVehicleForBookingResponse >> ",
                addVehicleForBookingResponse?.message
              );
              console.log(
                "data to use for Booking Ui >> ",
                addVehicleForBookingResponse?.data
              );
              const vehicleForBookingData = addVehicleForBookingResponse?.data;
              setVehicleDetails(vehicleForBookingData);
              return;
            } else {
              console.log(
                "addVehicleForBookingErrResponse  >> ",
                addVehicleForBookingResponse?.error
              );
              return;
            }
          } catch (error) {
            console.log(
              "error tying to add vehicle data to and fetch from Booking Allocation Collection. >> ",
              error
            );
          }
        }
      } else {
        console.log(
          "fetchAvailableVehicleResponse >> ",
          fetchAvailableVehicleResponse?.message
        );
        setShowNoVehicleModal({
          show: true,
          message: fetchAvailableVehicleResponse?.message,
        });
        return;
      }
    } catch (error) {
      console.log("Error in getVehicle >>", error);
    }
  };

  const getEstimatedPrice = async (watchFrom, watchTo) => {
    // Get the current form values for 'from' and 'to'
    const from = watchFrom;
    const to = watchTo;

    // Make your API call here to fetch the estimated price based on 'from' and 'to'
    try {
      setRoutesLoading(true);
      const getSelectedRouteResponse = await getSelectedRoute(from, to);
      if (getSelectedRouteResponse?.success) {
        setSelectedRoute(getSelectedRouteResponse);
        console.log("getSelectedRouteResponse >> ", getSelectedRouteResponse);
        setRoutesLoading(false);
      } else {
        setShowNoRoutesModal(true);
        console.log("selected Route does not exist");
      }
    } catch (error) {
      console.error("Error at getting estimated price", error);
    }
  };

  const onSubmit = async (data) => {
    if (!authUser || !authUser.currentUser || !authUser.currentUser.uid) {
      // User is not logged in, display modal or take appropriate action
      openLoginRedirectModal();
      // You can display a modal or navigate to the login page here
      return;
    }
    const bookingData = {
      rider: authUser.currentUser.email,
      riderId: authUser.currentUser.uid,
      ...data,
      to: selectedDestination,
      from: selectedPickupPoint,
      rideType: selectedRideType,
      selectedSeats: selectedSeats,
      price: selectedRoute.data.fare * selectedSeats.length,
      driverUid: vehicleDetails?.driverUid,
      vehicleNumberPlate: vehicleDetails?.vehicleNumberPlate,
      vehicleId: vehicleDetails?.id,
    };
    if (!authUser) {
      alert("Please login first");
      openLoginRedirectModal();
      return;
    } else {
      try {
        console.log("Booking data to use >> ", bookingData);
        const registerNewBookingResponse = await registerNewBooking(
          bookingData
        );
        console.log(
          "registerNewBookingResponse >> ",
          registerNewBookingResponse
        );
        if (registerNewBookingResponse.bookingId) {
          setIsOpen(true);
          setBookingNumber(registerNewBookingResponse.bookingId);
        }
      } catch (error) {
        console.error("Error registering new booking:", error);
        throw error;
      }
    }

    // Handle form submission here
    console.log("bookingData >>", bookingData);
  };

  const saveTicketNumber = () => {
    console.log("saving Ticket ...");

    // check if a ticket exists in the local storage
    let ticketIndex = 0;
    while (localStorage.getItem(`ticket ${ticketIndex}`)) {
      ticketIndex++;
    }

    // set the ticket item with the next available index
    localStorage.setItem(`ticket ${ticketIndex}`, bookingNumber);
    navigate(`/settings/${user.user}/book-trip/success`);
  };

  const copyTicketNumber = () => {
    console.log("Copying Ticket ...");
    navigator.clipboard.writeText(bookingNumber).then(() => {
      alert("Copied!");
    });
    navigate(`/settings/${user.user}/book-trip/success`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Book Your Trip</h2>

      {/* Booking Successful Popup  */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
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
                      onClick={closeModal}
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
                    Booking Successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your booking has been successfully made. Here's your
                      booking ticket number: {bookingNumber}.
                    </p>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="flex  justify-around">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-[#F66E3C] hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={saveTicketNumber}
                      >
                        Save ticket
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-[#F66E3C] hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={copyTicketNumber}
                      >
                        Copy ticket
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      <Link
                        to="checkout"
                        className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-[#F66E3C] hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Proceed to checkout{" "}
                      </Link>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showLoginRedirectModal} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
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
                      onClick={closeLoginRedirectModal}
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
                    Please log in or create an account to continue
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Before you book your trip, please log in or create a new
                      account.Once you're logged in, you can connect your
                      Benkiko wallet to make payments.
                    </p>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="flex justify-center items-center">
                      <Link
                        to="/login"
                        className="rounded-md border border-transparent bg-[#F66E3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff4806] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Create account
                      </Link>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showNoRoutesModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 "
          onClose={closeNoRoutesModal}
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
                      onClick={closeNoRoutesModal}
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
                    Selected route does not exist
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      try the following desinations from{" "}
                      <span className="font-semibold">
                        {" "}
                        {selectedPickupPoint}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Booking unsuccessful Popup  */}

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="mb-4">
          <h3 className="mb-2">Choose preferred mode of transport</h3>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                {...register("transport")}
                value="express"
                className="mr-2"
              />
              Express
            </label>
            <label>
              <input
                type="radio"
                {...register("transport")}
                value="beba-beba"
                className="mr-2"
              />
              Beba Beba
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-2">Select Destination</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickup">From</label>
              <Combobox
                value={selectedPickupPoint}
                onChange={setSelectedPickupPoint}
              >
                <div className="relative mt-1">
                  <div className="relative border w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      displayValue={(location) => location}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredPickupPoints.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredPickupPoints.map((location) => (
                          <Combobox.Option
                            key={location}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-teal-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={location}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {location}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </div>

            <div>
              <label htmlFor="destination">To</label>
              <Combobox
                value={selectedDestination}
                onChange={setSelectedDestination}
              >
                <div className="relative mt-1">
                  <div className="relative w-full border cursor-default overflow-hidden rounded-lg bg-white text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      displayValue={(location) => location}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredDestinations.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredDestinations.map((location) => (
                          <Combobox.Option
                            key={location}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-teal-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={location}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {location}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                {...register("date")}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Time</label>
              <input
                type="time"
                {...register("time")}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-2">Select Your Ride</h3>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="ride"
                value="Mataxi Standard"
                onChange={handleRadioChange}
                checked={selectedRideType === "Mataxi Standard"}
                className="mr-2"
              />
              Mataxi Standard
            </label>
            <label>
              <input
                type="radio"
                name="ride"
                value="Mataxi XL"
                onChange={handleRadioChange}
                checked={selectedRideType === "Mataxi XL"}
                className="mr-2"
              />
              Mataxi XL
            </label>
            <label>
              <input
                type="radio"
                name="ride"
                value="Mataxi Luxe"
                onChange={handleRadioChange}
                checked={selectedRideType === "Mataxi Luxe"}
                className="mr-2"
              />
              Mataxi Luxe
            </label>
          </div>
        </div>
        <p>
          Selected Ride Type:{" "}
          {selectedRideType ? selectedRideType : "Select a ride type first"}
        </p>

        <div className="mb-4 ">
          <h3 className="mb-2">Select Your Seat Number</h3>

          {showNoVehicleModal?.show === true ? (
            <div className=" left-0 top-0 w-full h-32 my-6">
              <div className="bg-red-600 border border-rounded-lg py-4 px-6 border-yellow-600 text-white p-2 rounded-lg">
                {showNoVehicleModal?.message}
              </div>
            </div>
          ) : vehicleDetails ? (
            // Display seat selection options
            <div>
              <p>
                Available seats:{" "}
                {isNaN(selectedSeats.length)
                  ? "Select a Ride"
                  : parseInt(`${vehicleDetails?.availableSeats.length}`, 10) -
                    selectedSeats.length}
              </p>

              <div className="grid grid-cols-5 gap-4">
                {Array.from(
                  { length: parseInt(vehicleDetails?.seatCapacity, 10) },
                  (_, index) => {
                    const seatId = `${vehicleDetails?.vehicleNumberPlate}_seat${
                      index + 1
                    }`;
                    const isSeatBooked =
                      vehicleDetails?.bookedSeats.includes(seatId);
                    return (
                      <div
                        key={seatId}
                        className={`rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer ${
                          selectedSeats.includes(seatId)
                            ? "bg-[#F66E3C] text-white"
                            : isSeatBooked
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-white"
                        }`}
                        onClick={() => handleSeatClick(seatId, isSeatBooked)}
                      >
                        {index + 1}
                      </div>
                    );
                  }
                )}
              </div>
              <p>
                Unavailable seats{" "}
                {isNaN(selectedSeats.length)
                  ? "Select a Ride"
                  : `${selectedSeats.length} seats`}
              </p>

              <div className="flex space-x-2">
                {/* Unavailable seat icons */}
                {/* Set background color to #F66E3C for unavailable seats */}
              </div>
            </div>
          ) : (
            // Display message when no vehicle details are available
            <div className="bg-[#F66E3C] text-white p-2 rounded-lg">
              Select a ride to see available seats
            </div>
          )}
        </div>

        <div className="mb-4 border-b-2 border-[#F66E3C] p-2">
          <span>Estimated Price</span>
          {selectedSeats.length > 0 ? (
            <span className="float-right">
              {selectedRoute?.data?.fare
                ? selectedRoute?.data?.fare * selectedSeats?.length
                : " "}
            </span>
          ) : (
            <span className="float-right">
              {selectedRoute?.data?.fare || " 00"}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#F66E3C] text-white py-2 px-4 rounded-lg hover:bg-[#F74909] transition duration-300"
        >
          Book Now
        </button>

        {routesLoading && (
          <div
            role="status"
            class="absolute border rounded-lg shadow-md shadow-[#F66E3C]  bg-[#F66E3C]/50 flex justify-center items-center  left-0 top-0 w-full h-3/4"
          >
            <div className="flex justify-center items-center flex-col bg-white py-4 px-6 rounded-lg shadow-lg">
              <span className="text-lg text-black">
                Fetching the selected routes...
              </span>
              <span className="text-lg text-black py-2">Please Wait...</span>

              <svg
                aria-hidden="true"
                className=" my-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
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
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// TODO:
// Calculate estimated size by multiplying the number of seats selected. ~DONE
// Save the selected seat numbers. ~ DONE
// Create a "Bookings" collection in your Firestore database to store all booking data.
// Return the booking ID to the user and ask if they want to save it.
