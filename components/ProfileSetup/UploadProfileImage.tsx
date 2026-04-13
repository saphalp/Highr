import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UploadProfileImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Photo library access is needed to select a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePress = () => {
    Alert.alert("Select Option", "", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.avatarContainer}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View style={styles.avatar}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="camera-outline" size={32} color={Colors.textMuted} />
        )}
      </View>
      <Text style={styles.avatarLabel}>Upload Profile Photo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.inputBackground,
    borderWidth: 2,
    borderColor: Colors.outline,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  cancel: {},
});
