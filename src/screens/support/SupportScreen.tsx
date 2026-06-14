import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import Button from '../../components/common/Button';

export default function SupportScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }
    alert('Support request sent. Our team will reach out shortly.');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Need help?</Text>
      <Text style={styles.description}>
        Our support team is available 24/7. Send us a message or reach out using any of the options below.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live Chat</Text>
        <Text style={styles.cardText}>Chat with a support agent quickly and securely.</Text>
      </View>

      <View style={styles.contactRow}>
        <View style={styles.contactCard}>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>support@dataplus.com</Text>
        </View>
        <View style={styles.contactCard}>
          <Text style={styles.contactLabel}>Phone</Text>
          <Text style={styles.contactValue}>+234 800 123 4567</Text>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Describe your issue</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your message here"
          placeholderTextColor={COLORS.text.tertiary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        <Button label="Send Message" onPress={handleSend} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.lg,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SIZES.sm,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SIZES.xl,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SIZES.xs,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  contactCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.md,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SIZES.xs,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  formSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.sm,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SIZES.md,
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: SIZES.lg,
    backgroundColor: COLORS.background,
  },
});
