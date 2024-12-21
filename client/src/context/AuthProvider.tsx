import { createContext, ReactNode, useEffect } from "react";
import { getProfileApi } from "../apis/auth.ts";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/authSlice.ts";
import { IAuthContext } from "../types";

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
});

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    getProfileApi().then(({ profile }) => {
      console.log(profile);
      dispatch(updateProfile(profile));
    });
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
