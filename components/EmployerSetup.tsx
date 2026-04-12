import { Colors } from "@/constants/theme";
import { EMPTY_EMPLOYER_PROFILE, EmployerProfile } from "@/types/employer";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
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

export default function EmployerSetup() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<EmployerProfile>(EMPTY_EMPLOYER_PROFILE);

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const updateProfile = (fields: Partial<EmployerProfile>) => {
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
