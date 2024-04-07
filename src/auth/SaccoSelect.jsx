import React, { Fragment, useEffect, useState } from "react";
import { useForm, Controller, useController } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { useRoutesAndBookingFuntions } from "../firebase/firebase";
import { Combobox, Transition, Dialog } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const SaccoSelect = () => {
  const [saccos, setSaccos] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "sacco",
    control,
    defaultValue: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const { fetchSaccos } = useRoutesAndBookingFuntions();

  const fetchAllSaccos = async () => {
    const fetchSaccosResponse = await fetchSaccos();
    setSaccos(fetchSaccosResponse?.saccos);
    console.log("fetchSaccosResponse >> ", fetchSaccosResponse);
    console.log("fetchSaccosResponse.saccos >> ", fetchSaccosResponse.saccos);
    if (isOpen) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    fetchAllSaccos();
  }, []);

  const [selectedSacco, setSelectedSacco] = useState(
    saccos ? saccos[0] : "select Sacco"
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

  const onSubmit = async (data) => {
    localStorage.setItem("selectedSacco", JSON.stringify(selectedSacco));
    console.log("SUBMIT data >> ", data);
    console.log("selectedSacco >> ", selectedSacco);
    navigate("/signup/driver/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-3xl my-5">
          Select Your Sacco
        </p>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex h-screen items-center justify-center p-4 text-center ">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full shadow-xl border-b  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      An error occured while geting the Saccos
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Click the button below to fetch Saccos Again
                      </p>
                    </div>

                    <div className="mt-4 flex justify-around">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={fetchAllSaccos}
                      >
                        Fetch Saccos
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close X
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2">
            <Controller
              name="sacco"
              control={control}
              defaultValue=""
              render={() => (
                <Listbox value={selectedSacco} onChange={setSelectedSacco}>
                  <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm p-1">
                      <Listbox.Button className="flex first-letter:w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0">
                        {selectedSacco
                          ? selectedSacco.saccoName
                          : "Select a Sacco"}
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

          {/* Other form fields can be added here as needed. */}

          <button
            type="submit"
            className="bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover-bg-[#f57859]"
          >
            Sign Up
          </button>
        </form>

        <p className="text-md text-center mt-4">
          Already have an account?{" "}
          <Link to={`/signup/driver/`}>
            <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
              Submit
            </span>
          </Link>
        </p>
        <br />
        <p className="text-sm text-center ">
          don't see your sacco ?{" "}
          <button onClick={openModal}>
            <span className="text-blue-500 underline text-md font-bold cursor-pointer">
              fetch saccos
            </span>
          </button>
        </p>
      </div>
    </div>
  );
};

export default SaccoSelect;
