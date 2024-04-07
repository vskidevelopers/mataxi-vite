import React, { Fragment, useEffect, useState } from "react";
import { useForm, Controller, useController } from "react-hook-form";
import {
  useProfileFunctions,
  useRoutesAndBookingFuntions,
} from "../firebase/firebase";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { driverUser, authUser } from "../firebase/firebase";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ProfileCreate() {
  const userType = useParams();
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [saccos, setSaccos] = useState([]);
  const [spin, setSpin] = useState(false);
  const navigate = useNavigate();
  const {
    profilePictureImageURL,
    inspectionReportImageURL,
    insurancePolicyImageURL,
    profilePictureUploadProgress,
    inspectionReportUploadProgress,
    insurancePolicyUploadProgress,
    loading,
    uploadProfilePicture,
    uploadInspectionReport,
    uploadInsurancePolicy,
    updateDriverProfile,
    addVehicle,
    fetchDriverUserInfo,
    fetchRiderUserInfo,
  } = useProfileFunctions();

  const { fetchSaccos } = useRoutesAndBookingFuntions();

  const fetchUserDetails = async () => {
    if (userType.user === "Driver") {
      setUserDetails(await fetchDriverUserInfo(driverUser?.currentUser?.uid));
    } else {
      setUserDetails(await fetchRiderUserInfo(authUser?.currentUser?.uid));
    }
  };

  const refresh = () => {
    fetchUserDetails();
    setSpin(true);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchAllSaccos = async () => {
    const fetchSaccosResponse = await fetchSaccos();
    setSaccos(fetchSaccosResponse?.saccos);
    console.log("fetchSaccosResponse >> ", fetchSaccosResponse);
    console.log("fetchSaccosResponse.saccos >> ", fetchSaccosResponse.saccos);
  };

  useEffect(() => {
    fetchAllSaccos();
  }, []);

  console.log("driver info >>", userDetails);

  const {
    register,
    handleSubmit,
    control,
    reset,
    errors,
    getValues,
    setValue,
  } = useForm();

  const onDrop = (fieldName, acceptedFiles) => {
    // Use setValue to set the selected files in the form data
    setValue(fieldName, acceptedFiles[0]);
  };

  const [selectedSacco, setSelectedSacco] = useState(
    saccos ? saccos[0] : userDetails?.sacco
  );
  const [query, setQuery] = useState("");

  const filteredSaccos =
    query === ""
      ? saccos
      : saccos?.filter((sacco) =>
          sacco.saccoName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (data) => {
    // Handle form submission here
    console.log("SUBMIT data >> ", data);

    const { driverPicture, inspectionReport, insurancePolicy } = data;

    // Access each individual file
    const driverPictureFile = driverPicture[0];
    const inspectionReportFile = inspectionReport[0];
    const insurancePolicyFile = insurancePolicy[0];
    console.log("driverPictureFile>>", driverPictureFile);
    console.log("inspectionReportFile >>", inspectionReportFile);
    console.log("insurancePolicyFile>>", insurancePolicyFile);

    if (
      profilePictureImageURL &&
      inspectionReportImageURL &&
      insurancePolicyImageURL
    ) {
      console.log("Image URLs are available");
      console.log("ProfilePictureImageURL available>>", profilePictureImageURL);
      console.log(
        "InspectionReportImageURL available>>",
        inspectionReportImageURL
      );
      console.log(
        "setInsurancePolicyImageURL available>>",
        insurancePolicyImageURL
      );

      const driverProfileData = {
        driverPicture: profilePictureImageURL,
        inspectionReport: inspectionReportImageURL,
        insurancePolicy: insurancePolicyImageURL,
        licenseExpirationDate: data.licenseExpirationDate,
        licenseNumber: data.licenseNumber,
        saccoNumber: data.saccoNumber,
        seatCapacity: data.seatCapacity,
        vehicleColor: data.vehicleColor,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
      };
      const vehicleDetails = {
        sacco: data.sacco,
        driverUid: driverUser.currentUser.uid,
        seatCapacity: data.seatCapacity,
        vehicleColor: data.vehicleColor,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleNumberPlate: data.vehicleNumberPlate,
        isAvailable: false,
        isFull: false,
      };

      const rideType =
        data.rideType === "Mataxi Standard"
          ? "mataxiStandard"
          : data.rideType === "Mataxi XL"
          ? "mataxiXl"
          : data.rideType === "Mataxi Luxe"
          ? "mataxiLuxe"
          : null;

      try {
        const response = await updateDriverProfile(driverProfileData);
        console.log("ride Type >> ", rideType);
        const vehicleResponse = await addVehicle(vehicleDetails, rideType);
        console.log("Driver profile creation response >>", response);
        console.log("Vehicle Registration response >>", vehicleResponse);
        reset();
        navigate("/home");
      } catch (error) {
        console.error("Error occurred during creating Profile");
      }
    } else {
      console.log("ImagesUploaded...", imagesUploaded);
      console.log("else state variables...");
      console.log(
        "ProfilePictureImageURL available @else from firbase >>",
        profilePictureImageURL
      );
      console.log(
        "InspectionReportImageURL available @else>>",
        inspectionReportImageURL
      );
      console.log(
        "setInsurancePolicyImageURL available @else>>",
        insurancePolicyImageURL
      );
      if (!imagesUploaded) {
        alert("Checking Reports. Click Ok to continue");
        console.log("Image URLs not available.");

        if (driverPictureFile && inspectionReportFile && insurancePolicyFile) {
          // Upload files and handle upload progress
          uploadProfilePicture(driverPictureFile)
            .then((result) => {
              // setProfilePictureImageURL(result.data);
              console.log("profile pic url >>", result.data);
              return result.data;
            })
            .catch((error) => {
              console.error("Error uploading profile picture: ", error);
            });

          uploadInspectionReport(inspectionReportFile)
            .then((result) => {
              return result.data;
              // setInspectionReportImageURL(result.data);
            })
            .catch((error) => {
              console.error("Error uploading inspection report: ", error);
            });

          uploadInsurancePolicy(insurancePolicyFile)
            .then((result) => {
              // setInsurancePolicyImageURL(result.data);
              return result.data;
            })
            .catch((error) => {
              console.error("Error uploading insurance policy: ", error);
            });

          setImagesUploaded(true); // Flag to indicate that images have been uploaded
        }
      }
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month/day is a single digit
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mt-20 inset-0 flex justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi{" "}
        </h1>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#F66E3C]">
            Welcome{" "}
            {userDetails != null
              ? userDetails?.data?.driverUsername
              : "No driver"}
          </h2>

          {userDetails === null && (
            <span className="flex  group items-center">
              <p className=" text-sm text-slate-800 mr-5">
                {" "}
                Can't see your username? click here to reload
              </p>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      onClick={refresh}
                      className=" mr-5 py-1 px-3 border rounded-md border-[#F66E3C] bg-white group-hover:bg-[#F66E3C]"
                    >
                      <ArrowPathIcon
                        className={`${
                          spin ? "animate-spin" : ""
                        } h-4 w-4 text-[#F66E3C] group-hover:text-white`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reload</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#f66E3C]">
              Driver's Information
            </h2>

            <div className="mt-2">
              <label className="block mb-1 text-gray-600">
                Upload your picture
              </label>
              <div className="w-full border border-yellow-400 rounded py-2 px-3 cursor-pointer">
                <input
                  type="file"
                  {...register("driverPicture", { required: true })}
                  // disabled={userDetails != null ? true : false}
                />
                <p>
                  {errors?.driverPicture
                    ? "This field is required"
                    : "Drag and drop an image here or click to browse"}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <Controller
                name="licenseNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder={"Driver's License Number"}
                    className="border rounded-lg p-2 w-full"
                    // disabled={userDetails != null ? true : false}
                  />
                )}
              />
              {errors?.licenseNumber && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="mt-2">
              <Controller
                name="licenseExpirationDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    placeholder="Driver's License Expiration Date"
                    className="border rounded-lg p-2 w-full"
                    min={getCurrentDate()}
                  />
                )}
              />
              {errors?.licenseExpirationDate && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div className="mt-2">
              <Controller
                name="sacco"
                control={control}
                disabled={true}
                defaultValue={
                  selectedSacco?.saccoName
                    ? selectedSacco.saccoName
                    : userDetails
                    ? userDetails?.data?.sacco?.saccoName
                    : "reload to get saccos"
                }
                render={() => (
                  <Listbox value={selectedSacco} onChange={setSelectedSacco}>
                    <div className="relative mt-1">
                      <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm p-1">
                        <Listbox.Button className="flex w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0">
                          {selectedSacco
                            ? selectedSacco.saccoName
                            : userDetails
                            ? userDetails?.data?.sacco?.saccoName
                            : "Select a sacco"}
                          <div className="absolute top-0 right-0 flex h-full items-center">
                            <ChevronUpDownIcon className=" flex items-center pr-2 h-5 w-8 text-gray-400" />
                          </div>
                        </Listbox.Button>
                      </div>
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {filteredSaccos?.length === 0 && query !== "" ? (
                          <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredSaccos?.map((sacco) => (
                            <Listbox.Option
                              key={sacco.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-[#F66E3C] text-white"
                                    : "text-gray-900"
                                }`
                              }
                              value={sacco}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {sacco.saccoName}
                                  </div>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? "text-white" : "text-teal-600"
                                      }`}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))
                        )}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                )}
              />
            </div>

            <div className="mt-2">
              <Controller
                name="saccoNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder={"Sacco Number"}
                    className="border rounded-lg p-2 w-full"
                    // disabled={userDetails != null ? true : false}
                  />
                )}
              />
              {errors?.saccoNumber && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#f66E3C]">
              Vehicle Information
            </h2>

            <div className="mt-2">
              {/* Ride Type Dropdown */}
              <label className="block mb-1 text-gray-600">Ride Type</label>
              <select
                {...register("rideType", { required: true })}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Ride Type</option>
                <option value="Mataxi Standard">Mataxi Standard</option>
                <option value="Mataxi XL">Mataxi XL</option>
                <option value="Mataxi Luxe">Mataxi Luxe</option>
              </select>
              {errors?.rideType && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div className="mt-2">
              {/* <label className="block mb-1 text-gray-600">Vehicle Make</label> */}
              <Controller
                name="vehicleMake"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="text"
                      className="border rounded-lg p-2 w-full"
                      placeholder={"Vehicle Make"}
                      // disabled={userDetails != null ? true : false}
                    />
                    {errors?.vehicleMake && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mt-2">
              {/* <label className="block mb-1 text-gray-600">Vehicle Model</label> */}
              <Controller
                name="vehicleModel"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="text"
                      className="border rounded-lg p-2 w-full"
                      placeholder={"Vehicle Model"}
                      // disabled={userDetails != null ? true : false}
                    />
                    {errors?.vehicleModel && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mt-2">
              {/* <label className="block mb-1 text-gray-600">Vehicle Color</label> */}
              <Controller
                name="vehicleColor"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="text"
                      className="border rounded-lg p-2 w-full"
                      placeholder={"Vehicle Color"}
                      // disabled={userDetails != null ? true : false}
                    />
                    {errors?.vehicleColor && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mt-2">
              <Controller
                name="vehicleNumberPlate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="text"
                      className="border rounded-lg p-2 w-full"
                      placeholder={"Vehicle Number Plate"}
                      // disabled={userDetails != null ? true : false}
                    />
                    {errors?.vehicleNumberPlate && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mt-2">
              {/* <label className="block mb-1 text-gray-600">
                    Total Seat Capacity
                  </label> */}
              <Controller
                name="seatCapacity"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="number"
                      className="border rounded-lg p-2 w-full"
                      placeholder={"Total Seat Capacity"}
                      // disabled={userDetails != null ? true : false}
                    />
                    {errors?.seatCapacity && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mt-2">
              <label className="block mb-1 text-gray-600">
                Upload Vehicle Inspection Report
              </label>
              <div className="w-full border border-yellow-400 rounded py-2 px-3 cursor-pointer">
                <input
                  type="file"
                  {...register("inspectionReport", { required: true })}
                  // disabled={userDetails != null ? true : false}
                />
                <p>
                  {errors?.inspectionReport
                    ? "This field is required"
                    : "Drag and drop an image here or click to browse"}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <label className="block mb-1 text-gray-600">
                Upload Vehicle Insurance Policy
              </label>
              <div className="w-full border border-yellow-400 rounded py-2 px-3 cursor-pointer">
                <input
                  type="file"
                  {...register("insurancePolicy", { required: true })}
                  // disabled={userDetails != null ? true : false}
                />
                <p>
                  {errors?.insurancePolicy
                    ? "This field is required"
                    : "Drag and drop an image here or click to browse"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#F66E3C] text-white rounded-lg py-2 px-4 hover:bg-[#F74909] transition duration-300"
          >
            {loading
              ? " Checking Reports..."
              : imagesUploaded
              ? "Submit"
              : "Upload Reports"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileCreate;
