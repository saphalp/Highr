import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  color,
  focused,
}: {
  name: IoniconName;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "compass" : "compass-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "heart" : "heart-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.outline,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 82 : 62,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  iconWrapper: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperActive: {
    backgroundColor: `${Colors.primary}22`,
  },
});
