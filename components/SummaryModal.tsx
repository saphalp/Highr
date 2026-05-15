import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  visible: boolean;
  status: 'loading' | 'success' | 'error';
  message: string;
  onClose: () => void;
};

export default function SummaryModal({ visible, status, message, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>AI Summary</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {status === 'loading' && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Analyzing match…</Text>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.messageRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} style={styles.icon} />
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.messageRow}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" style={styles.icon} />
              <Text style={[styles.messageText, styles.errorText]}>{message}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: Colors.outline,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outline,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    minHeight: 80,
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    marginTop: 2,
  },
  messageText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  errorText: {
    color: '#FF6B6B',
  },
});
