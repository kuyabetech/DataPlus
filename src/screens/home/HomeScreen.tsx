import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchWalletBalance, generateVirtualAccount } from '../../store/slices/walletSlice';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
// ✅ REPLACE this line:
// import Clipboard from '@react-native-clipboard/clipboard';
// ✅ WITH this:
import * as Clipboard from 'expo-clipboard';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { balance, accountNumber, bankName, accountName } = useSelector(
    (state: RootState) => state.wallet
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(fetchWalletBalance());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGenerateAccount = async () => {
    await dispatch(generateVirtualAccount());
  };

  // ✅ UPDATE the copyToClipboard function for expo-clipboard:
  const copyToClipboard = async () => {
    if (accountNumber) {
      await Clipboard.setStringAsync(accountNumber);
      Alert.alert('Copied!', 'Account number copied to clipboard');
    }
  };

  const quickServices = [
    { id: 'data', name: 'Buy Data', icon: '📱📡', screen: 'BuyData' },
    { id: 'airtime', name: 'Buy Airtime', icon: '📞💰', screen: 'BuyAirtime' },
    { id: 'tv', name: 'TV Subscription', icon: '📺📡', screen: 'TVSubscription' },
    { id: 'electricity', name: 'Electricity', icon: '💡⚡', screen: 'Electricity' },
    { id: 'fund', name: 'Fund Wallet', icon: '💰📥', screen: 'FundWallet' },
    { id: 'transactions', name: 'Transactions', icon: '📜📊', screen: 'Transactions' },
  ];

  const popularPlans = [
    { id: 1, network: 'MTN', plan: '1GB', price: 350 },
    { id: 2, network: 'Airtel', plan: '2GB', price: 600 },
    { id: 3, network: 'Glo', plan: '1.5GB', price: 500 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.fullName?.split(' ')[0]}</Text>
          <Text style={styles.timeGreeting}>{getGreeting()}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={40} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Wallet Balance</Text>
        <Text style={styles.walletBalance}>₦{balance.toLocaleString()}</Text>
        
        {accountNumber ? (
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Account Number</Text>
            <TouchableOpacity style={styles.accountRow} onPress={copyToClipboard}>
              <Text style={styles.accountNumber}>{accountNumber}</Text>
              <Icon name="content-copy" size={18} color={COLORS.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.bankInfo}>
              {bankName} • {accountName}
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateAccount}>
            <Text style={styles.generateButtonText}>Generate Account Number</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.quickServices}>
        <Text style={styles.sectionTitle}>Quick Services</Text>
        <View style={styles.servicesGrid}>
          {quickServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              onPress={() => navigation.navigate(service.screen)}
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.popularPlans}>
        <Text style={styles.sectionTitle}>Popular Data Plans</Text>
        {popularPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planItem}
            onPress={() => navigation.navigate('BuyData', { network: plan.network })}
          >
            <View>
              <Text style={styles.planNetwork}>{plan.network}</Text>
              <Text style={styles.planName}>{plan.plan}</Text>
            </View>
            <Text style={styles.planPrice}>₦{plan.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>🎉 Get 5% Bonus on First Deposit!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.md,
  },
  greeting: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  timeGreeting: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: SIZES.xs,
  },
  walletCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.md,
    padding: SIZES.lg,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  walletLabel: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    opacity: 0.8,
  },
  walletBalance: {
    fontSize: 36,
    fontFamily: FONTS.heading,
    color: COLORS.surface,
    marginVertical: SIZES.sm,
  },
  accountInfo: {
    marginTop: SIZES.md,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  accountLabel: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    opacity: 0.7,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  accountNumber: {
    fontSize: 18,
    fontFamily: FONTS.bodyBold,
    color: COLORS.surface,
    marginRight: SIZES.sm,
  },
  bankInfo: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    opacity: 0.7,
    marginTop: SIZES.xs,
  },
  generateButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: SIZES.md,
  },
  generateButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
  },
  quickServices: {
    marginTop: SIZES.lg,
    paddingHorizontal: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SIZES.sm,
  },
  serviceItem: {
    width: '33.33%',
    padding: SIZES.sm,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: SIZES.xs,
  },
  serviceName: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  popularPlans: {
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.md,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planNetwork: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
  planName: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.primary,
  },
  promoBanner: {
    backgroundColor: COLORS.accent,
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.lg,
    padding: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoText: {
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    color: COLORS.surface,
  },
});

export default HomeScreen;