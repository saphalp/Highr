import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileRecruiter() {
    const router = useRouter();

    const [contactName, setContactName] = useState("");
    const [contactTitle, setContactTitle] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [about, setAbout] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [industry, setIndustry] = useState("");
    const [foundedYear, setFoundedYear] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [twitter, setTwitter] = useState("");
    const [culture, setCulture] = useState("");


    useEffect(() => {
        const loadEmployerProfile = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.log("Error loading user: ", userError);
                return;
            }

            const { data, error } = await supabase
                .from('Employer')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.log("Error loading employer profile: ", error);
                return;
            }

            if (!data) {
                return;
            }

            setContactName(data.contact_name ?? "");
            setContactTitle(data.contact_title ?? "");
            setContactPhone(data.contact_phone ?? "");
            setCompanyName(data.company_name ?? "");
            setWebsite(data.website ?? "");
            setAbout(data.about ?? "");
            setCity(data.city ?? "");
            setCountry(data.country ?? "");
            setIndustry(data.industry ?? "");
            setFoundedYear(data.founded_year ? String(data.founded_year) : "");
            setLinkedin(data.linkedin ?? "");
            setTwitter(data.twitter ?? "");
            setCulture(data.culture ?? "");
        };

        loadEmployerProfile();
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

        const { error } = await supabase.from('Employer').upsert({
            id: user.id,
            contact_name: contactName,
            contact_title: contactTitle,
            contact_phone: contactPhone,
            company_name: companyName,
            website: website,
            about: about,
            city: city,
            country: country,
            industry: industry,
            founded_year: foundedYear ? parseInt(foundedYear) : null,
            linkedin: linkedin,
            twitter: twitter,
            culture: culture,
        });

        if (error) {
            console.log("Error saving employer profile: ", error);
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
            <Text style={styles.title}>Edit Recruiter Profile</Text>

            <TextInput 
            label="Contact Name" 
            mode ="outlined" 
            value={contactName} 
            onChangeText={setContactName} 
            style={styles.input} />

            <TextInput 
            label="Contact Title" 
            mode ="outlined" 
            value={contactTitle} 
            onChangeText={setContactTitle} 
            style={styles.input} />

            <TextInput 
            label="Contact Phone" 
            mode ="outlined" 
            value={contactPhone} 
            onChangeText={setContactPhone} 
            style={styles.input} />

            <TextInput 
            label="Company Name" 
            mode ="outlined" 
            value={companyName} 
            onChangeText={setCompanyName} 
            style={styles.input} />

            <TextInput 
            label="Website" 
            mode ="outlined" 
            value={website} 
            onChangeText={setWebsite} 
            style={styles.input} />

            <TextInput 
            label="About" 
            mode ="outlined" 
            value={about} 
            onChangeText={setAbout} 
            multiline 
            style={styles.input} />

            <TextInput 
            label="City" 
            mode ="outlined" 
            value={city} 
            onChangeText={setCity} 
            style={styles.input} />

            <TextInput 
            label="Country" 
            mode ="outlined" 
            value={country} 
            onChangeText={setCountry} 
            style={styles.input} />

            <TextInput
            label="Industry"
            mode="outlined"
            value={industry}
            onChangeText={setIndustry}
            style={styles.input}
            />

            <TextInput
            label="Founded Year"
            mode="outlined"
            value={foundedYear}
            onChangeText={setFoundedYear}
            keyboardType="numeric"
            style={styles.input}
            />

            <TextInput
            label="LinkedIn"
            mode="outlined"
            value={linkedin}
            onChangeText={setLinkedin}
            style={styles.input}
            />

            <TextInput
            label="Twitter / X"
            mode="outlined"
            value={twitter}
            onChangeText={setTwitter}
            style={styles.input}
            />

            <TextInput
            label="Culture"
            mode="outlined"
            value={culture}
            onChangeText={setCulture}
            multiline
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

