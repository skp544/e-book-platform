import { createContext, ReactNode, useEffect } from "react";
import { getProfileApi, logoutApi } from "../apis/auth.ts";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthState,
  updateAuthStatus,
  updateProfile,
} from "../store/authSlice.ts";
import { IAuthContext } from "../types";

interface Props {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
  signOut: () => {},
});

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector(getAuthState);

  const signOut = async () => {
    dispatch(updateAuthStatus("busy"));
    await logoutApi();
    dispatch(updateAuthStatus("unauthenticated"));
    dispatch(updateProfile(null));
  };

  useEffect(() => {
    getProfileApi()
      .then(({ profile }) => {
        console.log(profile);
        dispatch(updateProfile(profile));
        dispatch(updateAuthStatus("authenticated"));
      })
      .catch(() => {
        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
      });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ profile, status, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
