import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { EducationEntry, ExperienceEntry, SkillEntry, SkillLevel } from '@/types/applicant';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileApplicant() {
    const router = useRouter();

    const [education, setEducation] = useState<EducationEntry[]>([]);
    const [experience, setExperience] = useState<ExperienceEntry[]>([]);
    const [skills, setSkills] = useState<SkillEntry[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [bio, setBio] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [github, setGithub] = useState("");

    const [educationInput, setEducationInput] = useState<EducationEntry>({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        current: false,
    });

    const [experienceInput, setExperienceInput] = useState<ExperienceEntry>({
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
    });

    const [skillInput, setSkillInput] = useState('');
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('Beginner');

    const skillLevels: SkillLevel[] = [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Expert',
    ];


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

            setEducation(Array.isArray(data.education) ? data.education : []);
            setExperience(Array.isArray(data.experience) ? data.experience : []);
            setSkills(Array.isArray(data.skills) ? data.skills : []);
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

            <Text style={styles.sectionTitle}>Personal Information</Text>

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
            label="Address" 
            mode ="outlined" 
            value={address} 
            onChangeText={setAddress} 
            style={styles.input} />

            <Text style={styles.sectionTitle}>Education</Text>

            <TextInput
            label="Institution"
            mode="outlined"
            value={educationInput.institution}
            onChangeText={(text) =>
                setEducationInput({ ...educationInput, institution: text })
            }
            style={styles.input} />

            <TextInput
            label="Degree Level"
            mode="outlined"
            value={educationInput.degree}
            onChangeText={(text) =>
                setEducationInput({ ...educationInput, degree: text })
            }
            style={styles.input} />

            <TextInput
            label="Field of Study"
            mode="outlined"
            value={educationInput.field}
            onChangeText={(text) =>
                setEducationInput({ ...educationInput, field: text })
            }
            style={styles.input} />

            <TextInput
            label="Start Year"
            mode="outlined"
            value={educationInput.startYear}
            onChangeText={(text) =>
                setEducationInput({ ...educationInput, startYear: text })
            }
            style={styles.input} />

            <TextInput
            label="End Year"
            mode="outlined"
            value={educationInput.endYear}
            onChangeText={(text) =>
                setEducationInput({ ...educationInput, endYear: text })
            }
            style={styles.input} />

            <Button
            mode="outlined"
            onPress={() => {
                if (!educationInput.institution.trim()) return;

                setEducation([...education, educationInput]);

                setEducationInput({
                institution: '',
                degree: '',
                field: '',
                startYear: '',
                endYear: '',
                current: false,
                });
            }}
            >
            Add Education
            </Button>

            <Text style={styles.currentList}>
            Current Education:
            {education.length > 0
                ? education.map((edu, i) => (
                    ` ${i + 1}. ${edu.degree} in ${edu.field} at ${edu.institution}`
                )).join('\n')
                : ' None'}
            </Text>

            <Text style={styles.sectionTitle}>Experience</Text>

            <TextInput
            label="Company"
            mode="outlined"
            value={experienceInput.company}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, company: text })
            }
            style={styles.input} />

            <TextInput
            label="Job Title"
            mode="outlined"
            value={experienceInput.title}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, title: text })
            }
            style={styles.input} />

            <TextInput
            label="Location"
            mode="outlined"
            value={experienceInput.location}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, location: text })
            }
            style={styles.input} />

            <TextInput
            label="Start Date"
            mode="outlined"
            value={experienceInput.startDate}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, startDate: text })
            }
            style={styles.input} />

            <TextInput
            label="End Date"
            mode="outlined"
            value={experienceInput.endDate}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, endDate: text })
            }
            style={styles.input} />

            <TextInput
            label="Description"
            mode="outlined"
            multiline
            value={experienceInput.description}
            onChangeText={(text) =>
                setExperienceInput({ ...experienceInput, description: text })
            }
            style={styles.input} />

            <Button
            mode="outlined"
            onPress={() => {
                if (!experienceInput.company.trim() || !experienceInput.title.trim()) return;

                setExperience([...experience, experienceInput]);

                setExperienceInput({
                company: '',
                title: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                });
            }}
            >
            Add Experience
            </Button>

            <Text style={styles.currentList}>
            Current Experience:
            {experience.length > 0
                ? experience.map((exp, i) => (
                    ` ${i + 1}. ${exp.title} at ${exp.company}`
                )).join('\n')
                : ' None'}
            </Text>

            <Text style={styles.sectionTitle}>Skills</Text>

            <TextInput
            label="Skill Name"
            mode="outlined"
            value={skillInput}
            onChangeText={setSkillInput}
            style={styles.input} />

            <Text style={styles.fieldLabel}>Skill Level</Text>

            <View style={styles.chipRow}>
            {skillLevels.map((level) => (
                <Chip
                key={level}
                selected={skillLevel === level}
                onPress={() => setSkillLevel(level)}
                style={styles.skillChip}
                textStyle={styles.skillChipText}
                >
                {level}
                </Chip>
            ))}
            </View>

            <Button
            mode="outlined"
            onPress={() => {
                if (!skillInput.trim()) return;

                setSkills([
                ...skills,
                {
                    name: skillInput.trim(),
                    level: skillLevel,
                },
                ]);

                setSkillInput('');
                setSkillLevel('Beginner');
            }}
            >
            Add Skill
            </Button>

            <Text style={styles.currentList}>
            Current Skills:
            {skills.length > 0
                ? skills.map((skill) => ` ${skill.name} (${skill.level})`).join(', ')
                : ' None'}
            </Text>

            <Text style={styles.sectionTitle}>Social Media</Text>

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
            style={styles.input} />

            <TextInput
            label="GitHub"
            mode="outlined"
            value={github}
            onChangeText={setGithub}
            style={styles.input} />


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
            marginBottom: 22,
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
        
        sectionTitle: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 18,
        },

        currentList: {
        color: Colors.textMuted,
        marginTop: 15,
        marginBottom: 15,
        lineHeight: 20,
        },

        fieldLabel: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        },

        chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 18,
        },

        skillChip: {
        backgroundColor: Colors.inputBackground,
        },

        skillChipText: {
        color: Colors.text,
        },

    });

