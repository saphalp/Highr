import { Colors } from '@/constants/theme';
import { EducationEntry, ExperienceEntry, SkillEntry } from '@/types/applicant';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

export type ApplicantRow = {
  id: string;
  f_name: string;
  l_name: string;
  address?: string;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  skills?: SkillEntry[];
  bio?: string;
  profile_pic?: string;
};

export default function ApplicantCard({ applicant }: { applicant: ApplicantRow }) {
  const fullName = `${applicant.f_name ?? ''} ${applicant.l_name ?? ''}`.trim();
  const initial = (applicant.f_name ?? '?')[0].toUpperCase();
  const topSkills = (applicant.skills ?? []).slice(0, 4);
  const latestExp = (applicant.experience ?? [])[0];
  const latestEdu = (applicant.education ?? [])[0];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {applicant.profile_pic ? (
          <Image source={{ uri: applicant.profile_pic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>Applicant</Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.name}>{fullName || 'Anonymous'}</Text>
        {latestExp ? (
          <Text style={styles.jobTitle}>{latestExp.title} @ {latestExp.company}</Text>
        ) : null}
        {applicant.address ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.infoText}> {applicant.address}</Text>
          </View>
        ) : null}
        {applicant.bio ? (
          <Text style={styles.bio} numberOfLines={2}>{applicant.bio}</Text>
        ) : null}
        {topSkills.length > 0 ? (
          <View style={styles.tagsRow}>
            {topSkills.map((s, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{s.name}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {latestEdu ? (
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.infoText} numberOfLines={1}>
              {' '}{latestEdu.degree} in {latestEdu.field}, {latestEdu.institution}
            </Text>
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
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  avatarBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  typeBadge: {
    backgroundColor: Colors.secondary,
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
  name: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  jobTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    color: Colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  bio: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
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
