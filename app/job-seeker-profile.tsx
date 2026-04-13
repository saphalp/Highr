import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function JobSeekerProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [experiences, setExperiences] = useState([
    { jobTitle: '', company: '', years: '', type: '' }
  ]);

  const addExperience = () => {
    setExperiences([...experiences, { jobTitle: '', company: '', years: '', type: '' }]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const inputTheme = {
    colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Basic Info</Text>
            <View style={styles.photoContainer}>
              <TouchableOpacity style={styles.photoButton}>
                <Text style={styles.photoPlus}>+</Text>
              </TouchableOpacity>
            </View>
            <TextInput label="Full Name" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Email" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Phone Number" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Location" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Experience</Text>
            {experiences.map((exp, index) => (
              <View key={index}>
                {index > 0 && <Text style={styles.expDivider}>Experience {index + 1}</Text>}
                <TextInput
                  label="Job Title"
                  mode="outlined"
                  style={styles.input}
                  textColor="#fff"
                  theme={inputTheme}
                  value={exp.jobTitle}
                  onChangeText={(text) => updateExperience(index, 'jobTitle', text)}
                />
                <TextInput
                  label="Company Name"
                  mode="outlined"
                  style={styles.input}
                  textColor="#fff"
                  theme={inputTheme}
                  value={exp.company}
                  onChangeText={(text) => updateExperience(index, 'company', text)}
                />
                <TextInput
                  label="Years of Experience"
                  mode="outlined"
                  style={styles.input}
                  textColor="#fff"
                  theme={inputTheme}
                  value={exp.years}
                  onChangeText={(text) => updateExperience(index, 'years', text)}
                />
                <TextInput
                  label="Employment Type"
                  mode="outlined"
                  style={styles.input}
                  textColor="#fff"
                  theme={inputTheme}
                  value={exp.type}
                  onChangeText={(text) => updateExperience(index, 'type', text)}
                />
              </View>
            ))}
            <Button mode="outlined" style={styles.addButton} textColor="#6C63FF" onPress={addExperience}>
              Add Another Experience
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Education</Text>
            <Text style={styles.subtitle}>Add latest one</Text>
            <TextInput label="Degree" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Field of Study" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="School/University" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Graduation Year" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Skills & Preferences</Text>
            <TextInput label="Skills" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Preferred Job Type" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="Expected Salary" mode="outlined" style={styles.input} textColor="#fff" theme={inputTheme} />
            <TextInput label="About Me" mode="outlined" style={[styles.input, styles.multiline]} textColor="#fff" theme={inputTheme} multiline numberOfLines={4} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` as any }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <Button
        mode="contained"
        style={styles.nextButton}
        labelStyle={styles.buttonText}
        onPress={step === totalSteps ? () => router.push('/') : nextStep}
      >
        {step === totalSteps ? 'Complete Profile' : 'Next'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 24,
    paddingTop: 48,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    color: '#888',
    fontSize: 12,
  },
  backButton: {
    color: '#888',
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2E2E3E',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E2E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlus: {
    color: '#6C63FF',
    fontSize: 32,
  },
  input: {
    backgroundColor: '#2E2E3E',
    marginBottom: 12,
  },
  multiline: {
    height: 100,
  },
  addButton: {
    borderColor: '#6C63FF',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  expDivider: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 4,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});