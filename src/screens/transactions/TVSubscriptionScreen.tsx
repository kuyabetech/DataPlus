import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

interface TVPlan {
  id: string;
  provider: string;
  plan: string;
  price: number;
  duration: string;
}

export default function TVSubscriptionScreen({ navigation }: any) {
  const [smartCard, setSmartCard] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const providers = [
    { id: '1', name: 'DStv' },
    { id: '2', name: 'GOtv' },
    { id: '3', name: 'StarTimes' },
  ];

  const plans: TVPlan[] = [
    { id: '1', provider: '1', plan: 'Premium', price: 28400, duration: '1 month' },
    { id: '2', provider: '1', plan: 'Compact', price: 14600, duration: '1 month' },
    { id: '3', provider: '2', plan: 'Max', price: 15000, duration: '1 month' },
    { id: '4', provider: '2', plan: 'Jinja', price: 9000, duration: '1 month' },
  ];

  const filteredPlans = selectedProvider
    ? plans.filter((p) => p.provider === selectedProvider)
    : [];

  const handleContinue = () => {
    if (!smartCard.trim() || !selectedPlan) {
      alert('Please fill all fields');
      return;
    }
    const plan = plans.find((p) => p.id === selectedPlan);
    navigation.navigate('ConfirmPurchase', {
      type: 'tv',
      smartCard,
      plan: plan?.plan,
      price: plan?.price,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="TV Subscription" onBack={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Select Provider</Text>
          <View style={styles.providersRow}>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerButton,
                  selectedProvider === provider.id && styles.providerButtonActive,
                ]}
                onPress={() => {
                  setSelectedProvider(provider.id);
                  setSelectedPlan(null);
                }}
              >
                <Text
                  style={[
                    styles.providerText,
                    selectedProvider === provider.id && styles.providerTextActive,
                  ]}
                >
                  {provider.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Smart Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter smart card number"
            value={smartCard}
            onChangeText={setSmartCard}
            keyboardType="number-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        {selectedProvider && (
          <View style={styles.section}>
            <Text style={styles.label}>Select Plan</Text>
            {filteredPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardActive,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.plan}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
                <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!smartCard || !selectedPlan}
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
  providersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    marginHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  providerButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  providerTextActive: {
    color: COLORS.text.inverse,
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
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  planCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.sm,
  },
  planDuration: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
});
