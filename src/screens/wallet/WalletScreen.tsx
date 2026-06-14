import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchWalletBalance, generateVirtualAccount } from '../../store/slices/walletSlice';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
// ✅ REPLACE this line:
// import Clipboard from '@react-native-clipboard/clipboard';
// ✅ WITH this:
import * as Clipboard from 'expo-clipboard';
import api from '../../services/api/apiClient';

const WalletScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { balance, accountNumber, bankName, accountName, isLoading } = useSelector(
    (state: RootState) => state.wallet
  );
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(fetchWalletBalance());
    fetchRecentTransactions();
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions?limit=3');
      setRecentTransactions(response.data.transactions);
    } catch (error) {
      // Mock data
      setRecentTransactions([
        { id: 1, type: 'data', description: 'MTN Data', amount: 300, date: 'Today, 4:30 PM' },
        { id: 2, type: 'airtime', description: 'Airtime', amount: 200, date: 'Today, 2:15 PM' },
        { id: 3, type: 'bills', description: 'Electricity', amount: 1500, date: 'Yesterday, 10:00 AM' },
      ]);
    }
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

  const handleFundWallet = () => {
    if (!accountNumber) {
      Alert.alert(
        'Generate Account First',
        'Please generate your virtual account number to fund your wallet',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate', onPress: handleGenerateAccount },
        ]
      );
    } else {
      navigation.navigate('FundWallet');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFundWallet}>
            <Icon name="add-circle" size={24} color={COLORS.surface} />
            <Text style={styles.actionButtonText}>Fund Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
            <Icon name="remove-circle" size={24} color={COLORS.surface} />
            <Text style={styles.actionButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {accountNumber ? (
        <View style={styles.accountCard}>
          <Text style={styles.accountLabel}>Virtual Account Details</Text>
          <TouchableOpacity style={styles.accountRow} onPress={copyToClipboard}>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
            <Icon name="content-copy" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.bankInfo}>
            {bankName} • {accountName}
          </Text>
          <Text style={styles.accountNote}>
            Fund this account via bank transfer. Funds reflect instantly.
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.generateCard} onPress={handleGenerateAccount}>
          <Icon name="account-balance-wallet" size={40} color={COLORS.primary} />
          <Text style={styles.generateTitle}>Generate Account Number</Text>
          <Text style={styles.generateSubtitle}>
            Get a virtual account to fund your wallet
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Icon name="receipt" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>-₦{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
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
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    margin: SIZES.lg,
    padding: SIZES.lg,
    borderRadius: 20,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: FONTS.heading,
    color: COLORS.surface,
    marginVertical: SIZES.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: SIZES.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: 8,
    marginRight: SIZES.md,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonText: {
    color: COLORS.surface,
    fontFamily: FONTS.bodyMedium,
    marginLeft: SIZES.xs,
  },
  accountCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.lg,
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accountLabel: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginBottom: SIZES.xs,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountNumber: {
    fontSize: 20,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
  bankInfo: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: SIZES.xs,
  },
  accountNote: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: SIZES.sm,
    fontStyle: 'italic',
  },
  generateCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.lg,
    padding: SIZES.xl,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  generateTitle: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
    marginTop: SIZES.md,
  },
  generateSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: SIZES.xs,
    textAlign: 'center',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text.primary,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
});

export default WalletScreen;