import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        theme="dark"
        autoClose={5000}
        hideProgressBar={false}
        rtl={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
      />
    </>
  );
};

export default ToastMessage;
