import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileApplicant() {
    const router = useRouter();

        const [education, setEducation] = useState("");
        const [experience, setExperience] = useState("");
        const [skills, setSkills] = useState("");
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [phone, setPhone] = useState("");
        const [address, setAddress] = useState("");
        const [bio, setBio] = useState("");
        const [linkedin, setLinkedin] = useState("");
        const [portfolio, setPortfolio] = useState("");
        const [github, setGithub] = useState("");


    useEffect(() => {
        const loadApplicantProfile = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.log("Error loading user: ", userError);
                return;
            }

            const { data, error } = await supabase
                .from('Applicant')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.log("Error loading applicant profile: ", error);
                return;
            }

            if (!data) {
                return;
            }

            setEducation(data.education ?? "");
            setExperience(data.experience ?? "");
            setSkills(data.skills ?? "");
            setFirstName(data.f_name ?? "");
            setLastName(data.l_name ?? "");
            setPhone(data.phone ?? "");
            setAddress(data.address ?? "");
            setBio(data.bio ?? "");
            setLinkedin(data.linkedin ?? "");
            setPortfolio(data.portfolio ?? "");
            setGithub(data.github ?? "");
        };

        loadApplicantProfile();
    }, []);


    const handleSave = async () => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log("Error loading user: ", userError);
            return;
        }

        const { error } = await supabase.from('Applicant').upsert({
            id: user.id,
            education: education,
            experience: experience,
            skills: skills,
            f_name: firstName,
            l_name: lastName,
            phone: phone,
            address: address,
            bio: bio,
            linkedin: linkedin,
            portfolio: portfolio,
            github: github,
        });

        if (error) {
            console.log("Error saving applicant profile: ", error);
            return;
        }

        router.back();
    };


    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
            <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Edit Applicant Profile</Text>

            <TextInput 
            label="First Name" 
            mode ="outlined" 
            value={firstName} 
            onChangeText={setFirstName} 
            style={styles.input} />

            <TextInput 
            label="Last Name" 
            mode ="outlined" 
            value={lastName} 
            onChangeText={setLastName} 
            style={styles.input} />

            <TextInput 
            label="Contact Phone" 
            mode ="outlined" 
            value={phone} 
            onChangeText={setPhone} 
            style={styles.input} />

            <TextInput 
            label="Bio" 
            mode ="outlined" 
            value={bio} 
            onChangeText={setBio} 
            multiline 
            style={styles.input} />

            <TextInput 
            label="Education" 
            mode ="outlined" 
            value={education} 
            onChangeText={setEducation} 
            style={styles.input} />

            <TextInput 
            label="Experience" 
            mode ="outlined" 
            value={experience} 
            onChangeText={setExperience} 
            multiline 
            style={styles.input} />

            <TextInput 
            label="Skills" 
            mode ="outlined" 
            value={skills} 
            onChangeText={setSkills} 
            style={styles.input} />

            <TextInput 
            label="Address" 
            mode ="outlined" 
            value={address} 
            onChangeText={setAddress} 
            style={styles.input} />

            <TextInput
            label="LinkedIn"
            mode="outlined"
            value={linkedin}
            onChangeText={setLinkedin}
            style={styles.input}
            />

            <TextInput
            label="Portfolio"
            mode="outlined"
            value={portfolio}
            onChangeText={setPortfolio}
            style={styles.input}
            />

            <TextInput
            label="GitHub"
            mode="outlined"
            value={github}
            onChangeText={setGithub}
            style={styles.input}
            />

            <View style={styles.buttonRow}>
            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.cancelButton}
                labelStyle={styles.cancelLabel}
            >
                Cancel
            </Button>

            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
            >
                Save Changes
            </Button>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
            padding: 16,
        },
        title: {
            color: Colors.text,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 24,
            textAlign: "center",
        },
        input: {
            backgroundColor: Colors.inputBackground,
            marginBottom: 12,
        },
        button: {
            backgroundColor: Colors.primary,
            borderRadius: 8,
            marginTop: 16,
            padding: 4,
        },
        keyboardView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 40,
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 16,
        },
        cancelButton: {
            flex: 1,
            marginRight: 8,
            borderRadius: 8,
        },
        saveButton: {
            flex: 1,
            marginLeft: 8,
            borderRadius: 8,
            backgroundColor: Colors.primary,
        },
        cancelLabel: {
            color: Colors.textMuted,
        },

    });

