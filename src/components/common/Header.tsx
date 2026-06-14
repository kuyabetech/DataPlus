import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES } from '../../constants/colors';

interface HeaderProps {
  title: string;
  onBack: () => void;
  showAction?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, showAction, actionLabel, onActionPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    {showAction ? (
      <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.actionPlaceholder} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  actionButton: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionPlaceholder: {
    width: 40,
  },
});

export default Header;
