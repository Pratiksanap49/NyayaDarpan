import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout as logoutAction } from "./authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  const login = async (args) => {
    const result = await dispatch(loginUser(args)).unwrap();
    return result.user;
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return { user, token, loading, login, logout };
};
