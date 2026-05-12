import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

export type JobPostingRow = {
  id: string;
  employer_id: string;
  job_name: string;
  location?: string;
  company_name: string;
  description?: string;
  skills?: string[];
  salary?: string;
};

export default function JobPostingCard({
  posting,
  onAiPress,
}: {
  posting: JobPostingRow;
  onAiPress?: () => void;
}) {
  const skills = posting.skills ?? [];
  const initial = (posting.company_name || '?')[0].toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.companyBadge}>
          <Text style={styles.companyBadgeText}>{initial}</Text>
        </View>
        <View style={styles.cardTopRight}>
          {posting.salary ? (
            <View style={styles.salaryBadge}>
              <Text style={styles.salaryBadgeText}>{posting.salary}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.aiButton} onPress={onAiPress} activeOpacity={0.75}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.jobTitle}>{posting.job_name}</Text>
        <Text style={styles.companyName}>{posting.company_name}</Text>
        {posting.location ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.infoText}> {posting.location}</Text>
          </View>
        ) : null}
        {posting.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {posting.description}
          </Text>
        ) : null}
        {skills.length > 0 ? (
          <View style={styles.tagsRow}>
            {skills.map((skill, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: height * 0.62,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTop: {
    flex: 1,
    backgroundColor: Colors.outline,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  cardTopRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  aiButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  companyBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyBadgeText: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  salaryBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  salaryBadgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottom: {
    padding: 20,
    backgroundColor: Colors.surface,
  },
  jobTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.outline,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
