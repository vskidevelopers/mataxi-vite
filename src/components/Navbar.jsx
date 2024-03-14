import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useProfileFunctions } from "../firebase/firebase";
import { driverUser } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [userData, setUserData] = useState({
    isAuthenticated: false,
    userType: null,
  });
  const { logout } = useProfileFunctions();
  const navigate = useNavigate();
  const loggedInUserType = localStorage.getItem("isDriver")
    ? "Driver"
    : "Rider";

  useEffect(() => {
    const auth = driverUser;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({
          isAuthenticated: true,
          userType: loggedInUserType,
        });
      } else {
        setUserData({
          isAuthenticated: false,
          userType: null,
        });
      }
    });

    return () => unsubscribe();
  }, [loggedInUserType]);

  const handleLogout = async () => {
    try {
      console.log("logging out ...");
      await logout();
      navigate("/home", { replace: true });
    } catch (error) {
      console.log("the following error occured during logout", error);
    }
  };
  return (
    <Disclosure as="nav" className="fixed top-0 z-50 w-full bg-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link to="/home">
                  <h1 className="ml-2 text-[#F66E3C] text-xl font-bold">
                    Mataxi
                  </h1>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#f74909]">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 text-[#F66E3C]" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-[#F66E3C] ring-opacity-5 focus:outline-none">
                      {userData.isAuthenticated ? (
                        <>
                          {userData.userType === "Driver" && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/accounts/${userData.userType}/profile`}
                                  className="block px-4 py-2 text-sm text-gray-700"
                                >
                                  Profile
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={`/settings/${userData.userType}/settings`}
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="login"
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Log In
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="signup"
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Sign Up
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
