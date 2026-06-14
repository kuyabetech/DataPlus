import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/colors';

const SplashScreen = ({ navigation }: any) => {
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>💳🔌</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={{ opacity: opacityValue }}>
        <Text style={styles.appName}>DataPlus</Text>
        <Text style={styles.tagline}>Data Plus</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Fast • Secure • Reliable</Text>
        <View style={styles.loader}>
          <Animated.View style={[styles.loaderBar, { width: '100%' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xxl,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 60,
  },
  appName: {
    fontSize: 32,
    fontFamily: FONTS.heading,
    color: COLORS.surface,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: SIZES.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.surface,
    opacity: 0.7,
    marginBottom: SIZES.md,
  },
  loader: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 1,
  },
});

export default SplashScreen;