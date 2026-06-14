import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PinModal from '../../components/modals/PinModal';
import api from '../../services/api/apiClient';
import { useDispatch } from 'react-redux';
import { fetchWalletBalance } from '../../store/slices/walletSlice';

const ConfirmPurchaseScreen = ({ navigation, route }: any) => {
  const { type, network, phoneNumber, plan, amount, billerCode } = route.params;
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleConfirm = () => {
    setShowPinModal(true);
  };

  const handlePinSubmit = async (pin: string) => {
    setShowPinModal(false);
    setLoading(true);
    
    try {
      let response;
      if (type === 'data') {
        response = await api.post('/vtu/data', {
          network,
          phoneNumber,
          planId: plan.id,
          amount,
          pin,
        });
      } else if (type === 'airtime') {
        response = await api.post('/vtu/airtime', {
          network,
          phoneNumber,
          amount,
          pin,
        });
      } else if (type === 'bill') {
        response = await api.post('/vtu/bill', {
          billerCode,
          phoneNumber,
          amount,
          pin,
        });
      }

      if (response.data.success) {
        await dispatch(fetchWalletBalance());
        navigation.replace('Success', {
          type,
          network,
          phoneNumber,
          plan: plan?.size || plan?.name,
          amount,
          reference: response.data.reference,
        });
      }
    } catch (error: any) {
      Alert.alert('Transaction Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number:</Text>
            <Text style={styles.detailValue}>{phoneNumber}</Text>
          </View>
          
          {network && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network:</Text>
              <Text style={styles.detailValue}>{network}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan:</Text>
            <Text style={styles.detailValue}>{plan?.size || plan?.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₦{amount}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fee:</Text>
            <Text style={styles.detailValue}>₦0</Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₦{amount}</Text>
          </View>
        </View>

        <View style={styles.pinInfo}>
          <Icon name="security" size={20} color={COLORS.primary} />
          <Text style={styles.pinInfoText}>Secure transaction with PIN</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
        </TouchableOpacity>

        <Text style={styles.walletInfo}>
          Using wallet balance • Available: ₦{balance}
        </Text>
      </View>

      <PinModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinSubmit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text.primary,
  },
  totalRow: {
    marginTop: SIZES.sm,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.primary,
  },
  pinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.lg,
  },
  pinInfoText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginLeft: SIZES.xs,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
  walletInfo: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
  },
});

export default ConfirmPurchaseScreen;