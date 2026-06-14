import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api/apiClient';

const BuyDataScreen = ({ navigation, route }: any) => {
  const [selectedNetwork, setSelectedNetwork] = useState(route.params?.network || 'MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const networks = [
    { id: 'MTN', name: 'MTN', icon: '🔵', color: '#FFD700' },
    { id: 'Airtel', name: 'Airtel', icon: '🔴', color: '#FF0000' },
    { id: 'Glo', name: 'Glo', icon: '🟢', color: '#00FF00' },
    { id: '9mobile', name: '9mobile', icon: '💛', color: '#FFA500' },
  ];

  useEffect(() => {
    fetchDataPlans();
  }, [selectedNetwork]);

  const fetchDataPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/vtu/plans?network=${selectedNetwork}&type=data`);
      setDataPlans(response.data.plans);
    } catch (error) {
      // Fallback mock data
      setDataPlans([
        { id: 1, size: '500MB', price: 150, validity: '7 days' },
        { id: 2, size: '1GB', price: 300, validity: '30 days' },
        { id: 3, size: '2GB', price: 600, validity: '30 days' },
        { id: 4, size: '5GB', price: 1400, validity: '60 days' },
        { id: 5, size: '10GB', price: 2500, validity: '90 days' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedNetwork) {
      Alert.alert('Error', 'Please select a network');
      return;
    }
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a data plan');
      return;
    }

    navigation.navigate('ConfirmPurchase', {
      type: 'data',
      network: selectedNetwork,
      phoneNumber,
      plan: selectedPlan,
      amount: selectedPlan.price,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Network</Text>
        <View style={styles.networksGrid}>
          {networks.map((network) => (
            <TouchableOpacity
              key={network.id}
              style={[
                styles.networkItem,
                selectedNetwork === network.id && styles.networkItemSelected,
              ]}
              onPress={() => setSelectedNetwork(network.id)}
            >
              <Text style={styles.networkIcon}>{network.icon}</Text>
              <Text style={styles.networkName}>{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <Icon name="phone" size={20} color={COLORS.text.secondary} />
          <TextInput
            style={styles.phoneInput}
            placeholder="08012345678"
            placeholderTextColor={COLORS.text.tertiary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity>
            <Icon name="contacts" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Data Plan</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          dataPlans.map((plan: any) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planItem,
                selectedPlan?.id === plan.id && styles.planItemSelected,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View>
                <Text style={styles.planSize}>{plan.size}</Text>
                <Text style={styles.planValidity}>Valid for {plan.validity}</Text>
              </View>
                  <Text style={styles.planPrice}>₦{plan.price}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  section: {
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
    marginBottom: SIZES.md,
  },
  networksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkItem: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  networkItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  networkIcon: {
    fontSize: 32,
    marginBottom: SIZES.xs,
  },
  networkName: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text.primary,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  planSize: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
  planValidity: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.primary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
});

export default BuyDataScreen;