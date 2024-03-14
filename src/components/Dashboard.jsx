import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PublishRouteForm from "./PublishRouteForm";

export default function Dashboard() {
  let [isOpen, setIsOpen] = useState(false);
  const displayName = localStorage.getItem("username");
  const firstName = displayName?.split(" ")[0];
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const form = useRef();

  return (
    <div className="text-center">
      {/* NEW ROUTE FORM */}

      <h1 className="text-2xl font-semibold mt-8">Dashboard</h1>
      <div className="flex my-5">
        <div className="w-20  h-20 mt-2 rounded-full bg-cover bg-center bg-no-repeat bg-gray-900 overflow-hidden">
          <img
            src="https://cdn2.vectorstock.com/i/thumb-large/13/66/person-gray-photo-placeholder-man-vector-23511366.jpg"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>

        <div className=" px-6">
          <p className="text-xl text-[#F66E3C] font-semibold mt-2">
            Welcome {firstName}
          </p>
          <p className="text-sm text-gray-600 mt-1">Ratings: 4/5</p>
        </div>
      </div>

      <div className="flex justify-between my-6">
        <div>
          <p className="text-lg font-semibold">Total Earnings</p>
        </div>
        <div>
          <button
            onClick={openModal}
            className="bg-[#F66E3C] text-white py-2 px-4 rounded-lg"
          >
            Publish New Route
          </button>

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
                          className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                        className="text-2xl text-[#F66E3C] font-semibold mt-8"
                      >
                        Publish New Route
                      </Dialog.Title>

                      <div className="py-10 px-4">
                        <PublishRouteForm />
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>

      {/* Placeholder items */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#F66E3C]">Item 1</h2>
          <p className="text-gray-600 mt-2">Item description</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#F66E3C]">Item 2</h2>
          <p className="text-gray-600 mt-2">Item description</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#F66E3C]">Item 3</h2>
          <p className="text-gray-600 mt-2">Item description</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#F66E3C]">Item 4</h2>
          <p className="text-gray-600 mt-2">Item description</p>
        </div>
      </div>
    </div>
  );
}
