import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ApplicantBasicInfo from "./ProfileSetup/ApplicantBasicInfo";

const TOTAL_STEPS = 4;

export default function ApplicantSetup() {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressSection}>
        <Text style={styles.stepLabel}>
          Step {step} of {TOTAL_STEPS}
        </Text>
        <ProgressBar
          progress={step / TOTAL_STEPS}
          color={Colors.primary}
          style={styles.progressBar}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {step === 1 && <ApplicantBasicInfo />}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          contentStyle={styles.nextBtn}
          labelStyle={styles.nextBtnLabel}
        >
          Next
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
  },
  stepLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
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
  },
  nextBtn: {
    paddingVertical: 6,
  },
  nextBtnLabel: {
    fontSize: 18,
  },
});
