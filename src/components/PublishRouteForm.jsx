import React from "react";
import { useForm, Controller } from "react-hook-form";
import { driverUser, useRoutesAndBookingFuntions } from "../firebase/firebase";

export default function PublishRouteForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { registerNewRoute } = useRoutesAndBookingFuntions();
  const onSubmit = async (data) => {
    console.log({ ...data, author: driverUser.currentUser.email }); // You can handle form submission here
    const routeData = {
      ...data,
      author: driverUser.currentUser.email,
      approved: true,
    };
    try {
      const routeResponse = await registerNewRoute(routeData);
      console.log("routeResponse >>", routeResponse);
      reset();
    } catch (error) {
      console.warn("Error in submitting the new Route ", error);
    }
  };

  return (
    <div className="text-center">
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-gray-600 block">Start Point</label>
          <Controller
            name="startPoint"
            control={control}
            rules={{ required: "Start Point is required" }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Nairobi"
                className={`w-full border rounded-lg p-2 ${
                  errors.startPoint ? "border-red-500" : ""
                }`}
                {...field}
              />
            )}
          />
          {errors.startPoint && (
            <span className="text-red-500">{errors.startPoint.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="text-gray-600 block">End Point</label>
          <Controller
            name="endPoint"
            control={control}
            rules={{ required: "End Point is required" }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Thika"
                className={`w-full border rounded-lg p-2 ${
                  errors.endPoint ? "border-red-500" : ""
                }`}
                {...field}
              />
            )}
          />
          {errors.endPoint && (
            <span className="text-red-500">{errors.endPoint.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="text-gray-600 block">Fare</label>
          <Controller
            name="fare"
            control={control}
            rules={{
              required: "Fare is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Invalid fare amount",
              },
            }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Enter Fare"
                className={`w-full border rounded-lg p-2 ${
                  errors.fare ? "border-red-500" : ""
                }`}
                {...field}
              />
            )}
          />
          {errors.fare && (
            <span className="text-red-500">{errors.fare.message}</span>
          )}
        </div>
        {/* Add more fields related to publishing a new route here */}
        <button className="bg-[#F66E3C] text-white py-2 px-4 rounded-lg">
          Publish Route
        </button>
      </form>
    </div>
  );
}
