import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Header from '../../components/common/Header';

export default function ReferralScreen({ navigation }: any) {
  const referralCode = 'DATAPLUS123';
  const referralLink = 'https://dataplus.app/referral/DATAPLUS123';

  const handleCopy = () => {
    alert('Referral code copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <Header title="Referral" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Invite friends and earn rewards</Text>
        <Text style={styles.description}>
          Share your referral link and get bonuses when your friends sign up.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Referral Code</Text>
          <Text style={styles.code}>{referralCode}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Referral Link</Text>
          <Text style={styles.link}>{referralLink}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCopy}>
          <Text style={styles.buttonText}>Copy Referral Link</Text>
        </TouchableOpacity>
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
    padding: SIZES.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SIZES.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: SIZES.sm,
  },
  code: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  link: {
    fontSize: 14,
    color: COLORS.primary,
  },
  button: {
    marginTop: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
