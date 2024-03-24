import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// import { useAuthUserDataFunctions } from "./auth/AuthStateManager";

import { welcomeScreensData } from "./Utils/MataxiUtilsData";

import SplashScreen from "./pages/SplashScreen.jsx";
import UserUi from "./layouts/UserLayout";
import WelcomeScreen from "./pages/WelcomeScreen";
import HomePage from "./pages/HomePage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Mmemonics from "./auth/Mmemonics";
import AuthRedirectManager from "./auth/AuthRedirectManager";
import CreatePassword from "./auth/CreatePassword";
import SignUpComplete from "./auth/SignUpComplete";
import ImportWallet from "./auth/ImportWallet";
import ProfileCreate from "./pages/ProfileCreate";
import { AuthProvider } from "./auth/AuthContext";
import SaccoSelect from "./auth/SaccoSelect";
import SettingsUi from "./layouts/SettingsUi";
import BookTrip from "./components/BookTrip";
import Dashboard from "./components/Dashboard";
import BookTripSuccess from "./components/BookTripSuccess.jsx";
import WalletUi from "./layouts/WalletUi.jsx";
import Settings from "./components/Settings.jsx";
import EditProfile from "./components/EditProfile.jsx";
import WithdrawFunds from "./components/WithdrawFunds.jsx";
import DepositFund from "./components/DepositFund.jsx";
import BookTripCheckOut from "./components/BookTripCheckOut.jsx";
import Paymail from "./auth/Paymail.jsx";
import QueueManager from "./components/routeManager/QueueManager.jsx";
import DriverWalletAutoGenarateComplete from "./auth/DriverWalletAutoGenerateComplete.jsx";

// const { userData } = useAuthUserDataFunctions();
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* SplashScreen Route */}
      <Route path="/" element={<SplashScreen />} />
      <Route element={<UserUi />}>
        <Route
          path="welcome-screen/:title"
          element={<WelcomeScreen screensData={welcomeScreensData} />}
        />
        <Route path="home" element={<HomePage />} />

        {/* Login Route */}
        <Route path="login" element={<AuthRedirectManager func={"login"} />} />
        <Route path="login/:user" element={<Login />} />

        {/* Signup Routes */}
        <Route
          path="signup"
          element={<AuthRedirectManager func={"signup"} />}
        />
        <Route path="signup/:user" element={<Signup />} />
        <Route path="signup/:user/sacco" element={<SaccoSelect />} />
        <Route path="signup/:user/mmemonics" element={<Mmemonics />} />
        <Route
          path="signup/:user/create-password"
          element={<CreatePassword />}
        />
        <Route path="signup/:user/complete" element={<SignUpComplete />} />
        <Route path="signup/:user/import-wallet" element={<ImportWallet />} />

        {/* other Routes */}
        <Route path="accounts/:user/profile" element={<ProfileCreate />} />

        {/* Settings Routes */}
        <Route path="settings" element={<SettingsUi />}>
          <Route path=":user/book-trip">
            <Route index element={<BookTrip />} />
            <Route path="checkout" element={<BookTripCheckOut />} />
            <Route path="success" element={<BookTripSuccess />} />
          </Route>
          <Route path=":user/trip-history" element={<BookTripSuccess />} />
          <Route path=":user/dashboard" element={<Dashboard />} />
          <Route path=":user/wallet" element={<WalletUi />}>
            <Route index path="deposit" element={<DepositFund />} />
            <Route path="withdraw" element={<WithdrawFunds />} />
          </Route>
          <Route path=":user/settings">
            <Route index element={<Settings />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="paymail">
              <Route index element={<Paymail />} />
              <Route path="mmemonics" element={<Mmemonics />} />
              <Route path="confirm-mmemonics" element={<CreatePassword />} />
              <Route
                path="success"
                element={<DriverWalletAutoGenarateComplete />}
              />
            </Route>
          </Route>
          {/* <Route
            path="settings/:user/notification"
            element={<Notification />}
          />
          <Route path="settings/:user/settings" element={<Settings />} /> */}
        </Route>

        {/* Sacco Links */}
        <Route path="sacco.mataxi">
          <Route path="auth/login" />
          <Route path="home" />
          {/* <Route path="home"/> */}
        </Route>

        {/* Route Manager Links */}
        <Route path="route-manager">
          <Route path="auth/login" />
          <Route path="home" />
          <Route path="route-queue" element={<QueueManager />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
