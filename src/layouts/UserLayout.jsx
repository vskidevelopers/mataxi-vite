/* eslint-disable react/prop-types */

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserUi() {
  return (
    <div>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
