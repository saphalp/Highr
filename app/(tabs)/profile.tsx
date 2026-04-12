//profile settings screen

import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          router.push("/profile-setup");
        }}
      >
        Edit Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
