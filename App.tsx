import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants/colors';

// Auth Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

// Main App
import BottomTabNavigator from './src/components/navigation/BottomTabNavigator';

// Transaction Screens
import BuyDataScreen from './src/screens/transactions/BuyDataScreen';
import BuyAirtimeScreen from './src/screens/transactions/BuyAirtimeScreen';
import TVSubscriptionScreen from './src/screens/transactions/TVSubscriptionScreen';
import ElectricityScreen from './src/screens/transactions/ElectricityScreen';
import ConfirmPurchaseScreen from './src/screens/transactions/ConfirmPurchaseScreen';
import SuccessScreen from './src/screens/transactions/SuccessScreen';

// Wallet Screens
import FundWalletScreen from './src/screens/wallet/FundWalletScreen';
import WithdrawScreen from './src/screens/wallet/WithdrawScreen';

// Profile Screens
import ChangePasswordScreen from './src/screens/profile/ChangePasswordScreen';
import ChangePinScreen from './src/screens/profile/ChangePinScreen';
import KYCVerificationScreen from './src/screens/profile/KYCVerificationScreen';
import ReferralScreen from './src/screens/profile/ReferralScreen';

// Support
import SupportScreen from './src/screens/support/SupportScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="BuyData" component={BuyDataScreen} />
          <Stack.Screen name="BuyAirtime" component={BuyAirtimeScreen} />
          <Stack.Screen name="TVSubscription" component={TVSubscriptionScreen} />
          <Stack.Screen name="Electricity" component={ElectricityScreen} />
          <Stack.Screen name="ConfirmPurchase" component={ConfirmPurchaseScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="FundWallet" component={FundWalletScreen} />
          <Stack.Screen name="Withdraw" component={WithdrawScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="ChangePin" component={ChangePinScreen} />
          <Stack.Screen name="KYCVerification" component={KYCVerificationScreen} />
          <Stack.Screen name="Referral" component={ReferralScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}