import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  loading?: boolean;
}

const PinModal: React.FC<PinModalProps> = ({ visible, onClose, onConfirm, loading }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setPin('');
      setError('');
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleNumberPress = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      onConfirm(pin);
    } else {
      setError('Please enter 4-digit PIN');
    }
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View key={i} style={styles.pinDot}>
          {i < pin.length && <View style={styles.pinDotFilled} />}
        </View>
      );
    }
    return dots;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Enter Transaction PIN</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color={COLORS.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pinContainer}>{renderPinDots()}</View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={styles.keypadButton}
                    onPress={() => handleNumberPress(num)}
                  >
                    <Text style={styles.keypadNumber}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.keypadButton} onPress={() => {}}>
                  <Text style={styles.keypadNumber}></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(0)}
                >
                  <Text style={styles.keypadNumber}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={handleDelete}>
                  <Icon name="backspace" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.confirmButton, pin.length !== 4 && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={pin.length !== 4 || loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Processing...' : 'Confirm'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPin} onPress={() => {}}>
                <Text style={styles.forgotPinText}>Forgot PIN?</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    width: '85%',
    padding: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.lg,
  },
  pinDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginHorizontal: SIZES.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDotFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONTS.body,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: SIZES.lg,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.5%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  keypadNumber: {
    fontSize: 28,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
  forgotPin: {
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  forgotPinText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.body,
  },
});

export default PinModal;