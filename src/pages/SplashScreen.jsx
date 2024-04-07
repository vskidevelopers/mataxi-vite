import { useNavigate } from "react-router-dom";
import background from "../assets/images/background-map.png";
import { useEffect } from "react";

function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    // Simulate loading time, then navigate to Welcome Screen 1
    const loadingTimer = setTimeout(() => {
      navigate("/welcome-screen/welcome-to-mataxi");
    }, 3000); // 3000 milliseconds (3 seconds) for demonstration
    return () => clearTimeout(loadingTimer);
  }, [navigate]);
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F66E3C] overflow-clip">
      <img src={background} className="w-full h-[120%] object-cover" alt="" />
      <h1 className="text-6xl md:text-9xl font-bold text-black absolute">
        Mataxi
      </h1>
    </div>
  );
}

export default SplashScreen;
