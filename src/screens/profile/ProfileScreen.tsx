import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as LocalAuthentication from 'expo-local-authentication';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  const handleEnableFingerprint = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (compatible && enrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable fingerprint login',
      });
      if (result.success) {
        setFingerprintEnabled(true);
        Alert.alert('Success', 'Fingerprint login enabled');
      }
    } else {
      Alert.alert('Not Available', 'Fingerprint authentication is not available on this device');
    }
  };

  const menuSections = [
    {
      title: 'Security',
      items: [
        { icon: 'lock', label: 'Change Password', screen: 'ChangePassword' },
        { icon: 'pin', label: 'Change Transaction PIN', screen: 'ChangePin' },
        { icon: 'fingerprint', label: 'Enable Fingerprint', isSwitch: true, value: fingerprintEnabled, onValueChange: handleEnableFingerprint },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'verified-user', label: 'KYC Verification', screen: 'KYCVerification', badge: user?.kycStatus || 'pending' },
        { icon: 'notifications', label: 'Notifications', isSwitch: true, value: notifications, onValueChange: setNotifications },
        { icon: 'dark-mode', label: 'Dark Mode', isSwitch: true, value: darkMode, onValueChange: setDarkMode },
        { icon: 'share', label: 'Refer & Earn', screen: 'Referral' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', screen: 'Support' },
        { icon: 'info', label: 'About', screen: 'About' },
        { icon: 'privacy-tip', label: 'Privacy Policy', screen: 'Privacy' },
        { icon: 'description', label: 'Terms & Conditions', screen: 'Terms' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="edit" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0) || 'A'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.fullName || 'Abdulrahman Suleiman'}</Text>
        <Text style={styles.userHandle}>@{user?.fullName?.toLowerCase().replace(' ', '') || 'abdul'}</Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Icon name="phone" size={16} color={COLORS.text.secondary} />
            <Text style={styles.contactText}>{user?.phone || '+234 801 234 5678'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="email" size={16} color={COLORS.text.secondary} />
            <Text style={styles.contactText}>{user?.email || 'abdul@example.com'}</Text>
          </View>
        </View>
      </View>

      {menuSections.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIdx) => (
            <TouchableOpacity
              key={itemIdx}
              style={styles.menuItem}
              onPress={() => !item.isSwitch && item.screen && navigation.navigate(item.screen)}
              disabled={item.isSwitch}
            >
              <View style={styles.menuLeft}>
                <Icon name={item.icon} size={24} color={COLORS.primary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={[styles.badge, item.badge === 'verified' ? styles.verifiedBadge : styles.pendingBadge]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.isSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  />
                ) : (
                  <Icon name="chevron-right" size={20} color={COLORS.text.secondary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 2.0.0</Text>
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
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  profileInfo: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.xl,
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: FONTS.heading,
    color: COLORS.surface,
  },
  userName: {
    fontSize: 20,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  userHandle: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  contactInfo: {
    marginTop: SIZES.md,
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  contactText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginLeft: SIZES.xs,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.secondary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text.primary,
    marginLeft: SIZES.md,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: SIZES.sm,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.md,
    paddingVertical: SIZES.md,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.error,
    marginLeft: SIZES.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginBottom: SIZES.xl,
  },
});

export default ProfileScreen;