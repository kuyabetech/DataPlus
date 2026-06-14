import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

export default function BuyAirtimeScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const networks = [
    { id: '1', name: 'MTN', color: '#F4C430' },
    { id: '2', name: 'Airtel', color: '#E60000' },
    { id: '3', name: 'GLO', color: '#00A651' },
    { id: '4', name: '9mobile', color: '#FDB400' },
  ];

  const handleContinue = () => {
    if (!phone.trim() || !amount.trim() || !selectedNetwork) {
      alert('Please fill all fields');
      return;
    }
    navigation.navigate('ConfirmPurchase', {
      type: 'airtime',
      phone,
      amount,
      network: selectedNetwork,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Buy Airtime" onBack={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Select Network</Text>
          <View style={styles.networksGrid}>
            {networks.map((network) => (
              <TouchableOpacity
                key={network.id}
                style={[
                  styles.networkCard,
                  selectedNetwork === network.id && styles.networkCardActive,
                ]}
                onPress={() => setSelectedNetwork(network.id)}
              >
                <View
                  style={[
                    styles.networkColor,
                    { backgroundColor: network.color },
                  ]}
                />
                <Text style={styles.networkName}>{network.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!phone || !amount || !selectedNetwork}
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
  networksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  networkCard: {
    width: '48%',
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  networkCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  networkColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: SIZES.sm,
  },
  networkName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
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
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
});
