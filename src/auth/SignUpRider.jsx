import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUserDataFunctions } from "./AuthStateManager";

export default function SignUpRider({ userType }) {
  const navigate = useNavigate();
  const { generateMmemonics, userData, setUserData } =
    useAuthUserDataFunctions();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("user-type >>", userType.user);

  const handleGenerateMmemonics = async () => {
    if (userData.username) {
      console.log("userData at handleGenerateMmemonics", userData);
      console.log("Generating mmemonics...");
      try {
        await generateMmemonics();
        console.log("success in try. ok to navigate");
        console.log("currentuserData >>", userData);
      } catch (error) {
        console.log("error >>", error);
      }
      console.log("success after try. ok to navigate");
      if (userData.mmemonics) {
        console.log("if userData.mmemonics >>", userData);

        navigate(`/signup/${userType.user}/mmemonics`);
        setLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    try {
      if (username != "") {
        console.log(username, "username");
        setUserData((prevState) => ({
          ...prevState,
          username: username, // Update the 'mmemonics' property with the new value
        }));
        localStorage.setItem("username", username);
        handleGenerateMmemonics();
      } else {
        alert("Enter Username");
      }
    } catch (error) {
      setLoading(false);
      console.log("error >>", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-3">
        <h1 className="text-center text-2xl font-semibold mb-4 text-[#F66E3C]">
          Mataxi
        </h1>
        <p className="text-gray-600 font-bold text-3xl">Welcome !</p>
        <p className="text-gray-800 py-6 ">
          Enter your username to get started.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg pr-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`bg-[#f66E3C] text-white rounded-full py-2 px-4 mt-4 w-full hover:bg-[#f57859] flex justify-center items-center${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading && (
            <>
              <svg
                aria-hidden="true"
                className="my-2 mr-3 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="ml-2 text-white font-semibold">Loading...</span>
            </>
          )}
          {!loading && "Generate Phrase"}
        </button>
        <p className="text-md text-center mt-4">
          Already have a wallet?{" "}
          <Link to={`/signup/${userType.user}/import-wallet`}>
            <span className="text-[#f66E3C] text-lg font-bold cursor-pointer">
              Import
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
