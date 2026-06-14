import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

export default function ChangePinScreen({ navigation }: any) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSave = () => {
    if (!pin || !confirmPin) {
      alert('Please fill all fields');
      return;
    }
    if (pin !== confirmPin) {
      alert('Pins do not match');
      return;
    }
    alert('PIN updated successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Change PIN" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.label}>New PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new PIN"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.text.tertiary}
        />

        <Text style={styles.label}>Confirm PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new PIN"
          value={confirmPin}
          onChangeText={setConfirmPin}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.text.tertiary}
        />

        <Button label="Save PIN" onPress={handleSave} />
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    marginBottom: SIZES.lg,
    fontSize: 16,
    color: COLORS.text.primary,
  },
});
