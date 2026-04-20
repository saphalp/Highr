import BackButton from '@/components/BackButton';
import { Colors } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateJobScreen() {
  const router = useRouter();

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [pay, setPay] = useState("");
  const [hours, setHours] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Text style={styles.title}>Create Job Posting</Text>
      <BackButton /> 
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
        onPress={() => {router.back();}} // for now just go back to the previous screen, but in future send data to supabase and then go back
      >
        Submit Job Posting
      </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, },
  title: { color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', },
  input: { backgroundColor: Colors.inputBackground, marginBottom: 12, },
  button: { backgroundColor: Colors.primary, borderRadius: 8, marginTop: 16, padding: 4, },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
});
