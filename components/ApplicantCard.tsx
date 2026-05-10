import { Colors } from '@/constants/theme';
import { EducationEntry, ExperienceEntry, SkillEntry } from '@/types/applicant';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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

export default function ApplicantCard({
  applicant,
  appliedFor,
}: {
  applicant: ApplicantRow;
  appliedFor?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const fullName = `${applicant.f_name ?? ''} ${applicant.l_name ?? ''}`.trim();
  const initial = (applicant.f_name || '?')[0].toUpperCase();
  const topSkills = (applicant.skills ?? []).slice(0, 4);
  const latestExp = (applicant.experience ?? [])[0];
  const latestEdu = (applicant.education ?? [])[0];
  const hasPhoto = !!applicant.profile_pic && !imgError;

  return (
    <View style={styles.card}>
      {/* Top photo area */}
      <View style={styles.cardTop}>
        {hasPhoto ? (
          <Image
            source={{ uri: applicant.profile_pic }}
            style={styles.coverImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>
        )}

        {/* Job Seeker badge — teal, top-left */}
        <View style={styles.typeBadge}>
          <Ionicons name="person" size={11} color="#fff" />
          <Text style={styles.typeBadgeText}>  Job Seeker</Text>
        </View>

        {/* Name scrim overlay at bottom of photo */}
        <View style={styles.photoScrim}>
          <Text style={styles.scrimName} numberOfLines={1}>{fullName || 'Anonymous'}</Text>
          {latestExp ? (
            <Text style={styles.scrimRole} numberOfLines={1}>
              {latestExp.title} · {latestExp.company}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Info section */}
      <View style={styles.cardBottom}>
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
        {appliedFor ? (
          <View style={styles.appliedRow}>
            <Ionicons name="briefcase-outline" size={12} color={TEAL} />
            <Text style={styles.appliedText} numberOfLines={1}> Applied for: {appliedFor}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const TEAL = '#00BFA5';

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
    borderLeftWidth: 3,
    borderLeftColor: TEAL,
  },
  cardTop: {
    flex: 1,
    backgroundColor: '#1a2a2a',
    overflow: 'hidden',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  typeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  photoScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.52)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrimName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrimRole: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  cardBottom: {
    padding: 16,
    backgroundColor: Colors.surface,
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
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: `${TEAL}22`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${TEAL}55`,
  },
  tagText: {
    color: TEAL,
    fontSize: 11,
    fontWeight: '500',
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  appliedText: {
    color: TEAL,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});
