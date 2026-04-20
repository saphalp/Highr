import ApplicantSetup from "@/components/ApplicantSetup";
import EmployerSetup from "@/components/EmployerSetup";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

export default function profileSetup() {
  const { isApplicant } = useLocalSearchParams<{ isApplicant: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isApplicant === "true" ? <ApplicantSetup /> : <EmployerSetup />}
    </>
  );
}
