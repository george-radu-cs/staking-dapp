import { useContext } from "react";
import ToastContext from "../contexts/ToastContext";

const UseToastContext = () => {
  return useContext(ToastContext);
}

export default UseToastContext;
