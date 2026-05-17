import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, registerUser, logout, clearError } from '../../../store/slices/authSlice';
import { User } from '../constants';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: { email: string; password: string }) => {
    return await dispatch(loginUser(credentials));
  };

  const register = async (userData: Partial<User> & { passwordHash: string }) => {
    return await dispatch(registerUser(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const resetError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: loading,
    error,
    login,
    register,
    logout: handleLogout,
    resetError,
  };
};
