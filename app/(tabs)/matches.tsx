import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MATCHES = [
  {
    id: 1,
    name: 'Google',
    role: 'Software Engineer',
    location: 'Mountain View, CA',
    matchedOn: 'Today',
    initial: 'G',
  },
  {
    id: 2,
    name: 'Apple',
    role: 'Product Designer',
    location: 'Cupertino, CA',
    matchedOn: 'Yesterday',
    initial: 'A',
  },
  {
    id: 3,
    name: 'Meta',
    role: 'Data Scientist',
    location: 'Menlo Park, CA',
    matchedOn: '2 days ago',
    initial: 'M',
  },
];

export default function Matches() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>{MATCHES.length} mutual matches</Text>
      </View>

      {/* Matches List */}
      <FlatList
        data={MATCHES}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.matchCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.initial}</Text>
            </View>
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{item.name}</Text>
              <Text style={styles.matchRole}>{item.role}</Text>
              <Text style={styles.matchLocation}>📍 {item.location}</Text>
            </View>
            <View style={styles.matchRight}>
              <Text style={styles.matchedOn}>{item.matchedOn}</Text>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>Keep swiping to find your perfect match!</Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  matchRole: {
    color: Colors.primary,
    fontSize: 13,
    marginBottom: 2,
  },
  matchLocation: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  matchRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  matchedOn: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
