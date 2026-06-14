import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const SuccessScreen = ({ navigation, route }: any) => {
  const { type, network, phoneNumber, plan, amount, reference } = route.params;

  const handleDownloadReceipt = async () => {
    const receipt = `
      DATAPLUS RECEIPT
      ─────────────────
      Transaction ID: ${reference}
      Date: ${new Date().toLocaleString()}
      Type: ${type.toUpperCase()}
      Network: ${network}
      Plan: ${plan}
      Phone: ${phoneNumber}
      Amount: ₦${amount}
      Status: ✅ Successful
      ─────────────────
      Thank you for using DataPlus!
    `;
    
    const filePath = FileSystem.documentDirectory + `receipt_${reference}.txt`;
    await FileSystem.writeAsStringAsync(filePath, receipt);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert('Error', 'Sharing not available');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just purchased ${plan} on ${network} for ₦${amount} using DataPlus! Fast and reliable. Download DataPlus today!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <View style={styles.circle}>
          <Icon name="check" size={60} color={COLORS.surface} />
        </View>
      </View>

      <Text style={styles.title}>Transaction Successful!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transaction Details</Text>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Plan:</Text>
          <Text style={styles.detailValue}>{plan}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Network:</Text>
          <Text style={styles.detailValue}>{network}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{phoneNumber}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>₦{amount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference ID:</Text>
          <TouchableOpacity onPress={() => Alert.alert('Copied', 'Reference copied')}>
            <Text style={[styles.detailValue, styles.reference]}>{reference}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReceipt}>
        <Icon name="download" size={20} color={COLORS.primary} />
        <Text style={styles.downloadButtonText}>Download Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Icon name="share" size={20} color={COLORS.text.secondary} />
        <Text style={styles.shareButtonText}>Share Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  successIcon: {
    marginTop: SIZES.xxxl,
    marginBottom: SIZES.xl,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
    marginBottom: SIZES.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.lg,
    width: '100%',
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
  reference: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '100%',
    marginBottom: SIZES.md,
  },
  downloadButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.bodyMedium,
    marginLeft: SIZES.sm,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: SIZES.md,
  },
  doneButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
  },
  shareButtonText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontFamily: FONTS.body,
    marginLeft: SIZES.sm,
  },
});

export default SuccessScreen;