import type { ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "react-toastify";

export default function App(): ReactElement {
  return (
    <>
      <RouterProvider router={router} />;
      <ToastContainer
        progressClassName="custom-toast-progress"
        toastStyle={{
          backgroundColor: "rgb(26, 26, 26)",
          color: "#d9d7ceff",
          fontFamily: "Poppins, sans serif",
        }}
      />
    </>
  );
}
