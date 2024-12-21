import { createContext, ReactNode, useEffect } from "react";
import { getProfileApi } from "../apis/auth.ts";
import {useDispatch, useSelector} from "react-redux";
import {getAuthState, updateAuthStatus, updateProfile} from "../store/authSlice.ts";
import { IAuthContext } from "../types";

interface Props {
  children: ReactNode;
}

export  const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
});

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const {profile, status}  = useSelector(getAuthState)


  useEffect(() => {
    getProfileApi().then(({ profile }) => {
      console.log(profile);
      dispatch(updateProfile(profile));
      dispatch(updateAuthStatus("authenticated"));
    }).catch(() => {
        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
    });
  }, []);

  return <AuthContext.Provider value={{profile, status}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
