import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';

export default function KYCVerificationScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [documentType, setDocumentType] = useState<string>('Passport');

  const documentTypes = ['Passport', 'Driver License', 'National ID'];

  const handleSubmit = () => {
    if (!fullName || !idNumber || !dob) {
      alert('Please fill all fields');
      return;
    }
    alert('KYC information submitted successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="KYC Verification" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Document Type</Text>
          <View style={styles.documentRow}>
            {documentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.documentButton,
                  documentType === type && styles.documentButtonActive,
                ]}
                onPress={() => setDocumentType(type)}
              >
                <Text
                  style={[
                    styles.documentText,
                    documentType === type && styles.documentTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ID Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your ID number"
            value={idNumber}
            onChangeText={setIdNumber}
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
            placeholderTextColor={COLORS.text.tertiary}
          />
        </View>

        <Button label="Submit KYC" onPress={handleSubmit} />
      </ScrollView>
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
  section: {
    marginBottom: SIZES.xl,
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
    fontSize: 16,
    color: COLORS.text.primary,
  },
  documentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  documentButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  documentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  documentTextActive: {
    color: COLORS.text.inverse,
  },
});
