import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function Discover() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Highr</Text>
        <Ionicons name="notifications-outline" size={24} color={Colors.text} />
      </View>

      {/* Placeholder Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Ionicons name="briefcase-outline" size={64} color={Colors.primary} />
          <Text style={styles.cardTitle}>Job cards coming soon!</Text>
          <Text style={styles.cardSubtitle}>
            Swipe right to like a job.{'\n'}Swipe left to pass.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          style={styles.dislikeButton}
          labelStyle={styles.dislikeLabel}
          icon="close"
        >
          Pass
        </Button>
        <Button
          mode="contained"
          style={styles.likeButton}
          labelStyle={styles.likeLabel}
          icon="heart"
        >
          Like
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  cardContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 48,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  dislikeButton: {
    flex: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    borderWidth: 2,
  },
  dislikeLabel: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  likeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  likeLabel: {
    color: Colors.text,
    fontSize: 16,
  },
});