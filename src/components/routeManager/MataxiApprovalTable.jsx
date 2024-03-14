import React, { useState } from "react";
import { useRoutesAndBookingFuntions } from "../../firebase/firebase";

export default function MataxiApprovalTable({ data, selectedRideType }) {
  const { addVehicleToQueue, removeVehicleFromQueue } =
    useRoutesAndBookingFuntions();
  const [loading, setLoading] = useState(false);
  console.log("data from the table >> ", data);
  console.log("selectedRideType >> ", selectedRideType);
  const handleRemoveFromQueue = async (data) => {
    // Handle logic for removing from the queue
    console.log(`Removing ${data?.vehicleNumberPlate} from the queue`);
    try {
      const removeFromQueueResponse = await removeVehicleFromQueue(
        data,
        selectedRideType
      );
      console.log("removeFromQueueResponse >> ", removeFromQueueResponse);
    } catch (error) {
      console.log("error >> >> ", error);
    }
  };

  const handleAddToQueue = async (data) => {
    console.log("Data to add to queue  >> ", data);
    setLoading(true);
    // Handle logic for adding to the queue
    console.log(`Adding ${data?.id} to the queue`);
    try {
      const addToQueueResponse = await addVehicleToQueue(
        data,
        selectedRideType
      );
      console.log("addToQueueResponse >> ", addToQueueResponse);
    } catch (error) {
      console.log("error >> >> ", error);
    }
  };

  return (
    <div>
      <table className="w-full my-0 align-middle text-dark border-neutral-200">
        <thead className="align-bottom">
          <tr className="font-semibold text-[0.95rem] text-secondary-dark">
            <th className="pb-3 text-start min-w-[175px]">
              Vehicle Number Plate
            </th>
            <th className="pb-3 text-end min-w-[100px]">Driver</th>
            <th className="pb-3 text-end min-w-[100px]">Is Full</th>
            <th className="pb-3 pr-12 text-end min-w-[175px]">Is Available</th>
            <th className="pb-3 pr-12 text-end min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No vehicles in this category.
              </td>
            </tr>
          ) : (
            data?.map((entry) => (
              <tr
                key={entry?.vehicleNumberPlate}
                className="border-b border-dashed last:border-b-0 "
              >
                <td className="p-3 pl-0">
                  <div className="flex items-center">
                    <div className="relative inline-block shrink-0 rounded-2xl me-3">
                      {/* Add your vehicle image here */}
                      <img
                        src={entry?.imageSrc || "default-image-src.jpg"}
                        className="w-[50px] h-[50px] inline-block shrink-0 rounded-2xl"
                        alt={`Vehicle ${entry?.vehicleNumberPlate}`}
                      />
                    </div>
                    <div className="flex flex-col justify-start">
                      <a
                        href="javascript:void(0)"
                        className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary"
                      >
                        {entry?.vehicleNumberPlate}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="p-3 pr-0 text-end">
                  <span className="font-semibold text-light-inverse text-md/normal">
                    {entry?.driver || "Unknown Driver"}
                  </span>
                </td>
                <td className="p-3 pr-0 text-end">
                  <span
                    className={`text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none ${
                      entry?.isFull
                        ? "text-danger bg-danger-light"
                        : "text-success bg-success-light"
                    } rounded-lg`}
                  >
                    {entry?.isFull ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3 pr-12 text-end">
                  <span
                    className={`text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none ${
                      entry?.isAvailable
                        ? "text-primary bg-primary-light"
                        : "text-warning bg-warning-light"
                    } rounded-lg`}
                  >
                    {entry?.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="flex flex-col justify-around w-48 my-4 ">
                  <button
                    onClick={() => handleRemoveFromQueue(entry)}
                    className="bg-red-700 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded-2xl px-2 py-1 text-white mb-2"
                  >
                    Remove from Queue
                  </button>
                  <button
                    onClick={() => handleAddToQueue(entry)}
                    className="bg-amber-700 hover:bg-amber-600 active:bg-amber-700 focus:outline-none focus:ring focus:ring-amber-300 rounded-2xl px-2 py-1 text-white"
                  >
                    Add to Queue
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
