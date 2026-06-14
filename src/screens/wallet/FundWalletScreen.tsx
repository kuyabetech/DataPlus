import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export default function FundWalletScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods: PaymentMethod[] = [
    { id: '1', name: 'Debit Card', icon: '💳' },
    { id: '2', name: 'Bank Transfer', icon: '🏦' },
    { id: '3', name: 'USSD', icon: '📞' },
  ];

  const quickAmounts = [1000, 5000, 10000, 20000];

  const handleContinue = () => {
    if (!amount.trim() || !selectedMethod) {
      alert('Please fill all fields');
      return;
    }
    navigation.navigate('ConfirmPurchase', {
      type: 'fund_wallet',
      amount,
      method: methods.find((m) => m.id === selectedMethod)?.name,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Fund Wallet" onBack={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Enter Amount (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Quick Add</Text>
          <View style={styles.quickAmountsRow}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickButtonText}>
                  ₦{quickAmount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          {methods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text
                style={[
                  styles.methodName,
                  selectedMethod === method.id && styles.methodNameActive,
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Note</Text>
          <Text style={styles.infoText}>
            A transaction fee of ₦50 will be applied to this transaction.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!amount || !selectedMethod}
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
    paddingVertical: SIZES.lg,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: '48%',
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  methodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: SIZES.md,
  },
  methodName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  methodNameActive: {
    color: COLORS.primary,
  },
  infoBox: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    borderRadius: 8,
    marginBottom: SIZES.xl,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.info,
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
