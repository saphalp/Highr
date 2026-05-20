import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import {
  ApplicantProfile,
  EducationEntry,
  EMPTY_PROFILE,
  ExperienceEntry,
  SkillEntry,
} from "@/types/applicant";
import { File } from "expo-file-system";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ApplicantAdditionalInfo from "./ProfileSetup/ApplicantAdditionalInfo";
import ApplicantBasicInfo from "./ProfileSetup/ApplicantBasicInfo";
import ApplicantEducation from "./ProfileSetup/ApplicantEducation";
import ApplicantExperience from "./ProfileSetup/ApplicantExperience";
import ApplicantSkills from "./ProfileSetup/ApplicantSkills";

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Basic Info",
  "Education",
  "Experience",
  "Skills",
  "Additional Info",
];

// Returns an error message string if validation fails, or null if valid.
function validateStep(step: number, profile: ApplicantProfile): string | null {
  switch (step) {
    case 1: {
      if (!profile.fName?.trim()) return "First name is required.";
      if (!profile.lName?.trim()) return "Last name is required.";
      if (!profile.phone?.trim()) return "Phone number is required.";
      if (!profile.address?.trim()) return "Address is required.";
      return null;
    }
    case 2: {
      if (profile.education.length === 0)
        return "Please add at least one education entry.";
      return null;
    }
    case 3: {
      if (profile.experience.length === 0)
        return "Please add at least one experience entry.";
      return null;
    }
    case 4: {
      if (profile.skills.length === 0)
        return "Please add at least one skill.";
      return null;
    }
    case 5: {
      if (!profile.bio?.trim()) return "Bio is required.";
      return null;
    }
    default:
      return null;
  }
}

export default function ApplicantSetup() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ApplicantProfile>(EMPTY_PROFILE);
  const [stepError, setStepError] = useState<string | null>(null);

  const handleNext = async () => {
    const error = validateStep(step, profile);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);

    if (step === TOTAL_STEPS) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let profilePicUrl: string | null = null;

      if (profile.profileImageUri) {
        const file = new File(profile.profileImageUri);
        const bytes = await file.bytes();
        const storagePath = `applicants/${user.id}.jpeg`;
        const { error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(storagePath, bytes, {
            contentType: "image/jpeg",
            upsert: true,
          });
        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          return;
        }
        const { data: urlData } = supabase.storage
          .from("profile_pictures")
          .getPublicUrl(storagePath);
        profilePicUrl = urlData.publicUrl;
      }

      const { error: saveError } = await supabase.from("Applicant").upsert({
        id: user.id,
        f_name: profile.fName,
        l_name: profile.lName,
        phone: profile.phone,
        address: profile.address,
        education: profile.education,
        experience: profile.experience,
        skills: profile.skills,
        bio: profile.bio,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        github: profile.github,
        ...(profilePicUrl && { profile_pic: profilePicUrl }),
      });

      if (saveError) {
        console.error("Profile save failed:", saveError.message);
        return;
      }

      router.replace("/(tabs)/discover");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateProfile = (fields: Partial<ApplicantProfile>) => {
    setStepError(null);
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  const addEntry = <K extends "education" | "experience" | "skills">(
    key: K,
    entry: ApplicantProfile[K][number],
  ) => {
    setStepError(null);
    setProfile((prev) => ({
      ...prev,
      [key]: [entry, ...prev[key]],
    }));
  };

  const removeEntry = (
    key: "education" | "experience" | "skills",
    index: number,
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressSection}>
        <Text style={styles.stepLabel}>
          Step {step} of {TOTAL_STEPS}
        </Text>
        <ProgressBar
          progress={step / TOTAL_STEPS}
          color={Colors.secondary}
          style={styles.progressBar}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <ApplicantBasicInfo data={profile} onChange={updateProfile} />
        )}
        {step === 2 && (
          <ApplicantEducation
            entries={profile.education}
            onAdd={(entry: EducationEntry) => addEntry("education", entry)}
            onRemove={(i) => removeEntry("education", i)}
          />
        )}
        {step === 3 && (
          <ApplicantExperience
            entries={profile.experience}
            onAdd={(entry: ExperienceEntry) => addEntry("experience", entry)}
            onRemove={(i) => removeEntry("experience", i)}
          />
        )}
        {step === 4 && (
          <ApplicantSkills
            entries={profile.skills}
            onAdd={(entry: SkillEntry) => addEntry("skills", entry)}
            onRemove={(i) => removeEntry("skills", i)}
          />
        )}
        {step === 5 && (
          <ApplicantAdditionalInfo data={profile} onChange={updateProfile} />
        )}

        {stepError ? (
          <HelperText type="error" visible style={styles.errorText}>
            {stepError}
          </HelperText>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={handleBack}
            contentStyle={styles.backBtn}
            labelStyle={styles.backBtnLabel}
            style={styles.backBtnContainer}
          >
            Back
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleNext}
          contentStyle={styles.nextBtn}
          labelStyle={styles.nextBtnLabel}
          style={styles.nextBtnContainer}
        >
          {step === TOTAL_STEPS ? "Finish" : "Next"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 5,
  },
  stepLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  stepName: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outline,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  errorText: {
    fontSize: 13,
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    backgroundColor: Colors.background,
    flexDirection: "row",
    gap: 10,
  },
  backBtnContainer: {
    flex: 1,
    borderColor: Colors.outline,
    borderRadius: 8,
  },
  backBtn: {
    paddingVertical: 6,
  },
  backBtnLabel: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  nextBtnContainer: {
    flex: 2,
    borderRadius: 8,
  },
  nextBtn: {
    paddingVertical: 6,
  },
  nextBtnLabel: {
    fontSize: 18,
  },
});