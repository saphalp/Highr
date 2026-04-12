//this is where swipable cards will be displayed. This is the home page aka 'discover' page

import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function Discover() {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          router.push("/login");
        }}
      >
        Like
      </Button>
    </View>
  );
}

//custom styles but you c
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
