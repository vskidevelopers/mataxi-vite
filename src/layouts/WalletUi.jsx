import { Outlet } from "react-router-dom";

export default function WalletUi() {
  return (
    <div className=" inset-0 flex justify-center z-20">
      <Outlet />
    </div>
  );
}
