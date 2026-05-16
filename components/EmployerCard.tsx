import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

export type EmployerRow = {
  id: string;
  contact_name?: string;
  contact_title?: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  founded_year?: string;
  about?: string;
  city?: string;
  country?: string;
  work_types?: string[];
  logo?: string;
};

export default function EmployerCard({ employer }: { employer: EmployerRow }) {
  const location = [employer.city, employer.country].filter(Boolean).join(', ');
  const workTypes = employer.work_types ?? [];
  const initial = (employer.company_name || '?')[0].toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {employer.logo ? (
          <Image source={{ uri: employer.logo }} style={styles.logo} />
        ) : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{initial}</Text>
          </View>
        )}
        {workTypes[0] ? (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{workTypes[0]}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.companyName}>{employer.company_name}</Text>
        {employer.industry ? (
          <Text style={styles.industry}>{employer.industry}</Text>
        ) : null}
        {location ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.infoText}> {location}</Text>
          </View>
        ) : null}
        {employer.about ? (
          <Text style={styles.about} numberOfLines={3}>{employer.about}</Text>
        ) : null}
        {workTypes.length > 0 ? (
          <View style={styles.tagsRow}>
            {workTypes.map((t, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.footerRow}>
          {employer.company_size ? (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}> {employer.company_size}</Text>
            </View>
          ) : null}
          {employer.founded_year ? (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}> Est. {employer.founded_year}</Text>
            </View>
          ) : null}
        </View>
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
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  typeBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeBadgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottom: {
    padding: 20,
    backgroundColor: Colors.surface,
  },
  companyName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  industry: {
    color: Colors.primary,
    fontSize: 14,
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
  about: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
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
  footerRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
