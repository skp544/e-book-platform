import {AuthContext} from "../context/AuthProvider.tsx";
import {useContext} from "react";

const useAuth = () => {
    return   useContext(AuthContext);
}

export  default useAuth;