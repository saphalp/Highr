import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { EMPTY_EMPLOYER_PROFILE, EmployerProfile } from "@/types/employer";
import { File } from "expo-file-system";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import EmployerAdditionalInfo from "./ProfileSetup/EmployerAdditionalInfo";
import EmployerBasicInfo from "./ProfileSetup/EmployerBasicInfo";
import EmployerCompanyDetails from "./ProfileSetup/EmployerCompanyDetails";
import EmployerLocation from "./ProfileSetup/EmployerLocation";

const TOTAL_STEPS = 4;
const STEP_LABELS = [
  "Basic Info",
  "Company Details",
  "Location & Work Style",
  "Additional Info",
];

// Required:  contactName, contactTitle, contactPhone
// Required:  companyName, industry, companySize
// Optional:  website, about
// Required:  city, country, workTypes
// Optional:  linkedin, culture
function validateStep(step: number, profile: EmployerProfile): string | null {
  switch (step) {
    case 1: {
      if (!profile.contactName?.trim()) return "Contact name is required.";
      if (!profile.contactTitle?.trim()) return "Contact title is required.";
      if (!profile.contactPhone?.trim()) return "Contact phone is required.";
      return null;
    }
    case 2: {
      if (!profile.companyName?.trim()) return "Company name is required.";
      if (!profile.industry?.trim()) return "Industry is required.";
      if (!profile.companySize?.trim()) return "Company size is required.";
      // website and about are optional
      return null;
    }
    case 3: {
      if (!profile.city?.trim()) return "City is required.";
      if (!profile.country?.trim()) return "Country is required.";
      if (!profile.workTypes || profile.workTypes.length === 0)
        return "Please select at least one work type.";
      return null;
    }
    case 4: {
      // linkedin and culture are optional — step 4 always passes
      return null;
    }
    default:
      return null;
  }
}

export default function EmployerSetup() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<EmployerProfile>(
    EMPTY_EMPLOYER_PROFILE,
  );
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

      let logoUrl: string | null = null;

      if (profile.profileImageUri) {
        const file = new File(profile.profileImageUri);
        const bytes = await file.bytes();
        const storagePath = `${user.id}/profile.jpeg`;
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
        logoUrl = urlData.publicUrl;
      }

      const { error: saveError } = await supabase.from("Employer").upsert({
        id: user.id,
        contact_name: profile.contactName,
        contact_title: profile.contactTitle,
        contact_phone: profile.contactPhone,
        company_name: profile.companyName,
        industry: profile.industry,
        company_size: profile.companySize,
        founded_year: profile.foundedYear,
        website: profile.website,
        about: profile.about,
        city: profile.city,
        country: profile.country,
        work_types: profile.workTypes,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        culture: profile.culture,
        ...(logoUrl && { logo: logoUrl }),
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

  const updateProfile = (fields: Partial<EmployerProfile>) => {
    setStepError(null);
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressSection}>
        <View style={styles.stepLabelRow}>
          <Text style={styles.stepLabel}>
            Step {step} of {TOTAL_STEPS}
          </Text>
          <Text style={styles.stepName}>{STEP_LABELS[step - 1]}</Text>
        </View>
        <ProgressBar
          progress={step / TOTAL_STEPS}
          color={Colors.primary}
          style={styles.progressBar}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <EmployerBasicInfo data={profile} onChange={updateProfile} />
        )}
        {step === 2 && (
          <EmployerCompanyDetails data={profile} onChange={updateProfile} />
        )}
        {step === 3 && (
          <EmployerLocation data={profile} onChange={updateProfile} />
        )}
        {step === 4 && (
          <EmployerAdditionalInfo data={profile} onChange={updateProfile} />
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
  stepLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  stepName: {
    color: Colors.primary,
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