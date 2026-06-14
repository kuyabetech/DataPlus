import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

export default function WithdrawScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleContinue = () => {
    if (!amount.trim() || !bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      alert('Please fill all fields');
      return;
    }
    navigation.navigate('ConfirmPurchase', {
      type: 'withdraw',
      amount,
      bankName,
      accountNumber,
      accountName,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Withdraw Funds" onBack={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Select or enter bank name"
            value={bankName}
            onChangeText={setBankName}
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account name"
            value={accountName}
            onChangeText={setAccountName}
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Processing Time</Text>
          <Text style={styles.infoText}>
            Withdrawals are processed within 2-5 business days.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!amount || !bankName || !accountNumber || !accountName}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  infoBox: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    borderRadius: 8,
    marginBottom: SIZES.xl,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: SIZES.sm,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
});
