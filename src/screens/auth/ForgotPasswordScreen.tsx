import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api/apiClient';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { phone });
      Alert.alert('Success', 'OTP sent to your phone number');
      setStep(2);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter valid OTP');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone, otp });
      setStep(3);
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { phone, newPassword });
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.iconContainer}>
        <Icon name="lock-outline" size={80} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.description}>
        Enter your phone number and we'll send you an OTP to reset your password
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color={COLORS.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={COLORS.text.tertiary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.buttonText}>Send OTP</Text>}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.iconContainer}>
        <Icon name="verified-user" size={80} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.description}>
        Enter the 6-digit code sent to {phone}
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="pin" size={20} color={COLORS.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor={COLORS.text.tertiary}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSendOTP}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.iconContainer}>
        <Icon name="lock-reset" size={80} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>Create a new password for your account</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color={COLORS.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor={COLORS.text.tertiary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color={COLORS.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={COLORS.text.tertiary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>
      <View style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginTop: SIZES.xl,
    marginLeft: SIZES.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
  resendText: {
    textAlign: 'center',
    marginTop: SIZES.md,
    color: COLORS.primary,
    fontFamily: FONTS.body,
  },
});

export default ForgotPasswordScreen;