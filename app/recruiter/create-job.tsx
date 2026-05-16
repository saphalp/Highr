import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateJobScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [pay, setPay] = useState("");

  const handleSubmit = async () => {
    if (!jobName.trim() || !company.trim()) {
      Alert.alert("Missing fields", "Job name and company name are required.");
      return;
    }

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "You must be logged in to post a job.");
      setSubmitting(false);
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase.from("job_postings").insert({
      employer_id: user.id,
      job_name: jobName.trim(),
      description: description.trim(),
      skills: skillsArray,
      location: location.trim(),
      company_name: company.trim(),
      salary: pay.trim(),
    });

    setSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.back();
  };

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.log("User not found:", userError);
      return;
    }

    const { error } = await supabase.from("job_postings").insert({
      employer_id: user.id,
      job_name: jobName,
      job_description: description,
      skills: skills.split(",").map(skill => skill.trim()), // convert comma-separated string to array
      location: location,
      company_name: company,
      salary: pay ? Number(pay) : null, // convert to number if not empty
      work_type: hours,
    });

    if (error) {
      console.log("Error inserting job:", error);
      return;
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Text style={styles.title}>Create Job Posting</Text>

<<<<<<< HEAD
        <TextInput
          label="Job Name"
          mode="outlined"
          value={jobName}
          onChangeText={setJobName}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Job Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Relevant Skills (comma separated)"
          mode="outlined"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Location"
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Company Name"
          mode="outlined"
          value={company}
          onChangeText={setCompany}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <TextInput
          label="Estimated Pay"
          mode="outlined"
          value={pay}
          onChangeText={setPay}
          style={styles.input}
          textColor={Colors.text}
          theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
        />

        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit}
        >
          Submit Job Posting
        </Button>
=======
      <TextInput    // text input for job name
        label="Job Name"
        mode="outlined"
        value={jobName}
        onChangeText={setJobName}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // for now just a text input for description, but in future can be a rich text editor
        label="Job Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // for now just a text input for skills
        label="Relevant Skills (comma separated)"
        mode="outlined"
        value={skills}
        onChangeText={setSkills}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // text input for location
        label="Location"
        mode="outlined"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // for now just a text input, but in future can be a dropdown with company names associated with that specific recruiter
        label="Company Name"
        mode="outlined"
        value={company}
        onChangeText={setCompany}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // for now just a text input, but in future can add a dropdown for salary range and pay type (hourly or salary)
        label="Estimated Pay"
        mode="outlined"
        value={pay}
        onChangeText={setPay}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <TextInput    // for now just a text input for hours, but in future can be dropdown
        label="Work Hours"
        mode="outlined"
        value={hours}
        onChangeText={setHours}
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleSubmit}
      >
        Submit Job Posting
      </Button>
>>>>>>> ceae734... Connect job posting form to Supabase database
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: Colors.inputBackground, marginBottom: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, marginTop: 16, padding: 4 },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16 },
});
