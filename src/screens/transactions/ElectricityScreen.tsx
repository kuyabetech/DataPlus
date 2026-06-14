import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

interface MeterPlan {
  id: string;
  amount: number;
  units: string;
}

export default function ElectricityScreen({ navigation }: any) {
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedDisco, setSelectedDisco] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');

  const discos = [
    { id: '1', name: 'AEDC' },
    { id: '2', name: 'IBEDC' },
    { id: '3', name: 'KEDCO' },
    { id: '4', name: 'PHCN' },
  ];

  const plans: MeterPlan[] = [
    { id: '1', amount: 5000, units: '50 units' },
    { id: '2', amount: 10000, units: '100 units' },
    { id: '3', amount: 20000, units: '200 units' },
    { id: '4', amount: 50000, units: '500 units' },
  ];

  const handleContinue = () => {
    if (!meterNumber.trim() || !selectedDisco || !selectedPlan) {
      alert('Please fill all fields');
      return;
    }
    const plan = plans.find((p) => p.id === selectedPlan);
    navigation.navigate('ConfirmPurchase', {
      type: 'electricity',
      meterNumber,
      disco: discos.find((d) => d.id === selectedDisco)?.name,
      amount: plan?.amount,
      units: plan?.units,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Buy Electricity" onBack={() => navigation.goBack()} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Meter Type</Text>
          <View style={styles.meterTypeRow}>
            {['prepaid', 'postpaid'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  meterType === type && styles.typeButtonActive,
                ]}
                onPress={() => setMeterType(type as any)}
              >
                <Text
                  style={[
                    styles.typeText,
                    meterType === type && styles.typeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Disco</Text>
          <View style={styles.discoGrid}>
            {discos.map((disco) => (
              <TouchableOpacity
                key={disco.id}
                style={[
                  styles.discoCard,
                  selectedDisco === disco.id && styles.discoCardActive,
                ]}
                onPress={() => setSelectedDisco(disco.id)}
              >
                <Text
                  style={[
                    styles.discoName,
                    selectedDisco === disco.id && styles.discoNameActive,
                  ]}
                >
                  {disco.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Meter Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter meter number"
            value={meterNumber}
            onChangeText={setMeterNumber}
            keyboardType="number-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Plan</Text>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardActive,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planInfo}>
                <Text style={styles.planUnits}>{plan.units}</Text>
              </View>
              <Text style={styles.planAmount}>₦{plan.amount.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!meterNumber || !selectedDisco || !selectedPlan}
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
  meterTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    marginHorizontal: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  typeTextActive: {
    color: COLORS.text.inverse,
  },
  discoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discoCard: {
    width: '48%',
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  discoCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  discoName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  discoNameActive: {
    color: COLORS.primary,
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
  planUnits: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  planAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
});
