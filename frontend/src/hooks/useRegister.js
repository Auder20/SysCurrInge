// src/hooks/useRegister.js
import { useContext } from "react";
import RegisterContext from "../context/RegisterContext";

const useRegister = () => useContext(RegisterContext);

export default useRegister;
