import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export const PaymentsErrorElement = () => {
  const error = useRouteError();
  let errorMessage;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }
  // Uncaught ReferenceError: path is not defined
  return <div>Dang! </div>;
};
