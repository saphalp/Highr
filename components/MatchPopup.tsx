import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = {
  visible: boolean;
  onKeepSwiping: () => void;
  onSendMessage: () => void;
  jobTitle: string;
  company: string;
};

export default function MatchPopup({ visible, onKeepSwiping, onSendMessage, jobTitle, company }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
      setTimeout(() => confettiRef.current?.start(), 300);
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {visible && (
          <ConfettiCannon
            ref={confettiRef}
            count={100}
            origin={{ x: 200, y: 0 }}
            autoStart={false}
            fadeOut
            colors={[Colors.primary, '#FF6B6B', '#00C9FF', '#FFD700', '#fff']}
          />
        )}

        <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.heartsRow}>
            <Ionicons name="heart" size={40} color="#FF6B6B" />
            <Ionicons name="heart" size={56} color={Colors.primary} />
            <Ionicons name="heart" size={40} color="#FF6B6B" />
          </View>

          <Text style={styles.title}>It's a Match!</Text>
          <Text style={styles.subtitle}>
            You liked <Text style={styles.highlight}>{jobTitle}</Text> at{' '}
            <Text style={styles.highlight}>{company}</Text>
          </Text>
          <Text style={styles.description}>
            The employer has also shown interest in your profile!
          </Text>

          <TouchableOpacity style={styles.messageButton} onPress={onSendMessage}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.text} />
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keepSwipingButton} onPress={onKeepSwiping}>
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popup: {
    backgroundColor: Colors.surface,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  messageButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  messageButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  keepSwipingButton: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  keepSwipingText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
});
