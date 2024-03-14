import React, { useState } from "react";
import MataxiApprovalTable from "./MataxiApprovalTable";
import { Tab } from "@headlessui/react";
import { useRoutesAndBookingFuntions } from "../../firebase/firebase";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QueueManager() {
  const { fetchAllMataxis, fetchAllVehiclesInCollection } =
    useRoutesAndBookingFuntions();
  const [mataxiStandardData, setMataxiStandardData] = useState([]);
  const [mataxiXlData, setMataxiXlData] = useState({});
  const [mataxiLuxeData, setMataxiLuxeData] = useState({});
  const [allVehicles, setAllVehicles] = useState([]);

  const [fetchMataxisLoading, setFetchMataxisLoading] = useState(false);
  const [mataxiStandard, setMataxiStandard] = useState([]);
  const [mataxiLuxe, setMataxiLuxe] = useState([]);
  const [mataxiXl, setMataxiXl] = useState([]);
  console.log("mataxi std >>", mataxiStandard);
  console.log("mataxi luxe >>", mataxiLuxe);
  console.log("mataxi xl >>", mataxiXl);

  let categories = {
    MATAXI_STD: mataxiStandard,
    MATAXI_XL: mataxiXl,
    MATAXI_LUXE: mataxiLuxe,
  };

  const handleGetMataxis = async () => {
    setFetchMataxisLoading(true);
    try {
      const fetchMataxisResponse = await fetchAllMataxis();
      console.log("fetchMataxisResponse >> ", fetchMataxisResponse);

      if (fetchMataxisResponse) {
        fetchMataxisResponse.forEach((response) => {
          const { mataxiRideType, data } = response;

          if (mataxiRideType === "mataxiStandard" && data) {
            setMataxiStandard(data); // No need to wrap data in an array
          } else if (mataxiRideType === "mataxiXl" && data) {
            setMataxiXl(data);
          } else if (mataxiRideType === "mataxiLuxe" && data) {
            setMataxiLuxe(data);
          }
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching mataxis: ", error);
    } finally {
      setFetchMataxisLoading(false);
    }
  };
  const handleGetSaccoMataxis = async (saccoName) => {
    setFetchMataxisLoading(true);
    try {
      const fetchMataxisResponse = await fetchAllMataxis();
      console.log("fetchMataxisResponse >> ", fetchMataxisResponse);
    } catch (error) {}
  };

  const handleGetAllVehiclesInCollection = async (collectionName) => {
    console.log(`fetching allVehicles in ${collectionName}`);
    try {
      const allVehiclesInCollectionResponse =
        await fetchAllVehiclesInCollection(collectionName);
      console.log(
        `allVehiclesIn${collectionName}Response >> `,
        allVehiclesInCollectionResponse
      );
      // setMataxiStandard(allVehiclesInCollectionResponse.)
      if (allVehiclesInCollectionResponse) {
        allVehiclesInCollectionResponse.forEach((response) => {
          const { mataxiRideType, data } = response;

          if (mataxiRideType === "mataxiStandard" && data) {
            setMataxiStandard(data); // No need to wrap data in an array
          } else if (mataxiRideType === "mataxiXl" && data) {
            setMataxiXl(data);
          } else if (mataxiRideType === "mataxiLuxe" && data) {
            setMataxiLuxe(data);
          }
        });
      }
    } catch (error) {
      console.log("error >> ", error);
    }
  };

  const fetchDataAndMerge = async () => {
    const bookingAllocationCollection = "BookingAllocationCollection";
    const allVehiclesCollection = "VehicleCollection";
    try {
      // Fetch allVehicles from a Collection
      console.log("Initializing fetch & merge ...");
      const allVehiclesResponse = await fetchAllVehiclesInCollection(
        allVehiclesCollection
      );
      const allBookingAllocationVehiclesResponse =
        await fetchAllVehiclesInCollection(bookingAllocationCollection);

      // Log fetched responses
      console.log("allVehiclesResponse >> ", allVehiclesResponse);
      console.log(
        "allBookingAllocationVehiclesResponse >> ",
        allBookingAllocationVehiclesResponse
      );

      // Merge the data from both collections
      const mergedData = allVehiclesResponse.map((response) => {
        const validBookingAllocationVehicle =
          allBookingAllocationVehiclesResponse.find(
            (bookingVehicle) =>
              bookingVehicle.mataxiRideType === response.mataxiRideType
          );
        console.log(
          "validBookingAllocationVehicle >> ",
          validBookingAllocationVehicle
        );

        if (validBookingAllocationVehicle && response.data) {
          response.data.forEach((vehicle) => {
            const bookingVehicleData = validBookingAllocationVehicle.data[0]; // Assuming data is an array and taking the first item
            vehicle.isFull = bookingVehicleData.isFull ?? false;
            vehicle.isAvailable = bookingVehicleData.isAvailable ?? false;
          });
        }
        return response;
      });

      // Log merged data
      console.log("mergedData >> ", mergedData);

      // Set state variables for each mataxi category
      // Assuming you have separate state variables for each category like mataxiStandardData, mataxiXlData, mataxiLuxeData
      setMataxiStandardData(
        mergedData.find((data) => data.mataxiRideType === "mataxiStandard")
      );
      setMataxiXlData(
        mergedData.find((data) => data.mataxiRideType === "mataxiXl")
      );
      setMataxiLuxeData(
        mergedData.find((data) => data.mataxiRideType === "mataxiLuxe")
      );
    } catch (error) {
      console.error("Error fetching and merging data: ", error);
    }
  };

  // const fetchDataAndMerge = async () => {
  //   const bookingAllocationCollection = "BookingAllocationCollection";
  //   const allVehiclesCollection = "VehicleCollection";
  //   try {
  //     // Fetch allVehicles from a Collection
  //     console.log("initializing fetch & merge ...");
  //     const allVehiclesResponse = await fetchAllVehiclesInCollection(
  //       allVehiclesCollection
  //     );
  //     const allBookingAllocationVehiclesResponse =
  //       await fetchAllVehiclesInCollection(bookingAllocationCollection);

  //     // Merge the data from both collections
  //     if (
  //       allVehiclesResponse.success &&
  //       allBookingAllocationVehiclesResponse.success
  //     ) {
  //       console.log("allVehiclesResponse >> ", allVehiclesResponse);
  //       console.log(
  //         "allBookingAllocationVehiclesResponse >> ",
  //         allBookingAllocationVehiclesResponse
  //       );
  //       const mergedData = mergeData(
  //         allVehiclesResponse.data,
  //         allBookingAllocationVehiclesResponse.data
  //       );
  //       console.log("mergedData >> ", mergeData);

  //       // Set state variables for each mataxi category
  //       // Assuming you have separate state variables for each category like mataxiStandardData, mataxiXlData, mataxiLuxeData
  //       setMataxiStandardData(
  //         mergedData.filter(
  //           (vehicle) => vehicle.mataxiRideType === "mataxiStandard"
  //         )
  //       );
  //       setMataxiXlData(
  //         mergedData.filter((vehicle) => vehicle.mataxiRideType === "mataxiXl")
  //       );
  //       setMataxiLuxeData(
  //         mergedData.filter(
  //           (vehicle) => vehicle.mataxiRideType === "mataxiLuxe"
  //         )
  //       );
  //     } else if (
  //       (allVehiclesResponse.success &&
  //         !allBookingAllocationVehiclesResponse.success) ||
  //       (!allVehiclesResponse.success &&
  //         allBookingAllocationVehiclesResponse.success)
  //     ) {
  //       console.log("One fetch Operation Failed!");
  //       console.log("allVehiclesResponse >> ", allVehiclesResponse);
  //       console.log(
  //         "allBookingAllocationVehiclesResponse >> ",
  //         allBookingAllocationVehiclesResponse
  //       );
  //     } else {
  //       console.error("Both Fetch Operation Failed!");
  //       console.log("allVehiclesResponse >> ", allVehiclesResponse);
  //       console.log(
  //         "allBookingAllocationVehiclesResponse >> ",
  //         allBookingAllocationVehiclesResponse
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching and merging data: ", error);
  //   }
  // };

  const mergeData = (allVehiclesData, bookingAllocationData) => {
    console.log("merging Data ... ");
    return allVehiclesData.map((vehicle) => {
      const bookingDataForVehicle = bookingAllocationData.find(
        (booking) => booking.vehicleId === vehicle.id
      );
      if (bookingDataForVehicle) {
        return {
          ...vehicle,
          isFull: bookingDataForVehicle.isFull,
          isAvailable: bookingDataForVehicle.isAvailable,
        };
      } else {
        return {
          ...vehicle,
          isFull: false,
          isAvailable: false,
        };
      }
    });
  };

  return (
    <div className="mt-20 flex justify-center w-full">
      <div className="w-4/5 ">
        <div className="mb-6">
          <h1 className="text-[#F66E3C] font-bold">Welcome "username"</h1>
          <p className="text-[#F66E3C]">saccoName</p>
          <div className="flex items-center justify-around py-4">
            <button
              onClick={fetchDataAndMerge}
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-blue-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Button
            </button>
            <button
              onClick={() =>
                handleGetAllVehiclesInCollection("BookingAllocationCollection")
              }
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-blue-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              fetch Bookings
            </button>
            <button
              onClick={() =>
                handleGetAllVehiclesInCollection("AvailableVehicleCollection")
              }
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-blue-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              fetch Available
            </button>
            <button
              onClick={() =>
                handleGetAllVehiclesInCollection("VehicleCollection")
              }
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-blue-500 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              fetch all
            </button>
          </div>
        </div>

        {/* Add your tabular component here */}
        {/* Example: <YourTabularComponent /> */}
        <div>
          <div className="w-4/5  px-2 py-2 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "w-4/5 rounded-lg py-2.5 text-sm font-medium leading-5",
                        "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-white text-blue-700 shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {Object.entries(categories).map(([category, data], idx) => {
                  return (
                    <Tab.Panel
                      key={idx}
                      className={classNames(
                        "rounded-xl bg-white p-3",
                        "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                      )}
                    >
                      <MataxiApprovalTable
                        data={data}
                        selectedRideType={category}
                      />
                    </Tab.Panel>
                  );
                })}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        <p>This page is under construction. Please come back later.</p>
      </div>
    </div>
  );
}
