import { createContext, ReactNode, useEffect } from "react";
import { getProfileApi, logoutApi } from "../apis/auth.ts";
import { useDispatch, useSelector } from "react-redux";
import { IAuthContext } from "../types";
import {
  getAuthState,
  updateAuthStatus,
  updateProfile,
} from "../redux/slices/authSlice.ts";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
  signOut: () => {},
  updateProfileInfo: () => Promise.resolve(),
});

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector(getAuthState);
  const navigate = useNavigate();

  const signOut = async () => {
    dispatch(updateAuthStatus("busy"));
    await logoutApi();
    dispatch(updateAuthStatus("unauthenticated"));
    dispatch(updateProfile(null));
    navigate("/sign-up");
  };

  const updateProfileInfo = async () => {
    await getProfileApi()
      .then(({ data }) => {
        dispatch(updateProfile(data));
        dispatch(updateAuthStatus("authenticated"));
      })
      .catch(() => {
        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
      });
  };

  useEffect(() => {
    updateProfileInfo();
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{ profile, status, signOut, updateProfileInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
