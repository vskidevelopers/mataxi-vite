import { useParams } from "react-router-dom";
import LoginRider from "./LoginRider";
import LoginDriver from "./LoginDriver";

const Login = () => {
  const userType = useParams();

  if (userType.user === "driver") {
    return <LoginDriver userType={userType} />;
  } else if (userType.user === "rider") {
    return <LoginRider userType={userType} />;
  }
};
export default Login;
