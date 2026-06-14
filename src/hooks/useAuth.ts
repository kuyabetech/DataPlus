import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { login, register, logout, clearError } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadStoredAuth();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const loadStoredAuth = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedUser = await AsyncStorage.getItem('user');
    if (storedToken && storedUser) {
      // Auto-login if token exists
      // dispatch(setAuth({ token: storedToken, user: JSON.parse(storedUser) }));
    }
  };

  const handleLogin = async (phone: string, password: string) => {
    const result = await dispatch(login({ phone, password }));
    return result;
  };

  const handleRegister = async (userData: any) => {
    const result = await dispatch(register(userData));
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const authenticateWithBiometric = async () => {
    if (!biometricAvailable) {
      throw new Error('Biometric authentication not available');
    }
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometric',
      fallbackLabel: 'Use PIN',
    });
    
    return result.success;
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    biometricAvailable,
    handleLogin,
    handleRegister,
    handleLogout,
    authenticateWithBiometric,
    clearAuthError,
  };
};