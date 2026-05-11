import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
  const [imgError, setImgError] = useState(false);
  const location = [employer.city, employer.country].filter(Boolean).join(', ');
  const workTypes = employer.work_types ?? [];
  const initial = (employer.company_name || '?')[0].toUpperCase();
  const hasLogo = !!employer.logo && !imgError;

  return (
    <View style={styles.card}>
      {/* Top photo / logo area */}
      <View style={styles.cardTop}>
        {hasLogo ? (
          <Image
            source={{ uri: employer.logo }}
            style={styles.coverImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Ionicons name="business" size={36} color={`${Colors.primary}88`} style={{ marginBottom: 6 }} />
            <Text style={styles.fallbackText}>{initial}</Text>
          </View>
        )}

        {/* Employer badge — outlined, top-left */}
        <View style={styles.typeBadge}>
          <Ionicons name="briefcase-outline" size={11} color={Colors.primary} />
          <Text style={styles.typeBadgeText}>  Employer</Text>
        </View>

        {/* Company name scrim overlay at bottom */}
        <View style={styles.photoScrim}>
          <Text style={styles.scrimCompany} numberOfLines={1}>{employer.company_name}</Text>
          {employer.industry ? (
            <Text style={styles.scrimIndustry} numberOfLines={1}>{employer.industry}</Text>
          ) : null}
        </View>
      </View>

      {/* Info section */}
      <View style={styles.cardBottom}>
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  cardTop: {
    flex: 1,
    backgroundColor: '#1a1a30',
    overflow: 'hidden',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logoFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: 'bold',
  },
  typeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  photoScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20,18,50,0.72)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: `${Colors.primary}44`,
  },
  scrimCompany: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrimIndustry: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardBottom: {
    padding: 16,
    backgroundColor: Colors.surface,
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
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: `${Colors.primary}22`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${Colors.primary}55`,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '500',
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
