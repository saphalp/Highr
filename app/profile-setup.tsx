import ApplicantSetup from "@/components/ApplicantSetup";
import EmployerSetup from "@/components/EmployerSetup";
import { Stack } from "expo-router";
import React from "react";

export default function profileSetup() {
  const isApplicant = false; //should be pulled from the database
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isApplicant ? <ApplicantSetup /> : <EmployerSetup />}
    </>
  );
}
