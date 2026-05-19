import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const SKILL_OPTIONS = [
  "React", "React Native", "TypeScript", "JavaScript", "Python",
  "SQL", "Node.js", "Cybersecurity", "Cloud", "Figma",
];

type Props = {
  visible: boolean;
  onClose: () => void;
  searchText: string;
  onSearchChange: (v: string) => void;
  filterLocation: string;
  onLocationChange: (v: string) => void;
  locationSuggestions: string[];
  selectedSkills: string[];
  onSkillsChange: (v: string[]) => void;
  minPay: string;
  onMinPayChange: (v: string) => void;
  onReset: () => void;
  onApply: () => void;
};

function FilterChips({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option],
    );

  return (
    <View style={styles.filterChipWrap}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            onPress={() => toggle(option)}
          >
            <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FilterModal({
  visible,
  onClose,
  searchText,
  onSearchChange,
  filterLocation,
  onLocationChange,
  locationSuggestions,
  selectedSkills,
  onSkillsChange,
  minPay,
  onMinPayChange,
  onReset,
  onApply,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.filterOverlay}>
        <View style={styles.filterSheet}>
          <View style={styles.filterHandle} />

          <View style={styles.filterHeader}>
            <View>
              <Text style={styles.filterTitle}>Filter Jobs</Text>
              <Text style={styles.filterSubtitle}>
                Search by keyword, location, skills, or pay
              </Text>
            </View>
            <TouchableOpacity style={styles.filterCloseButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Search</Text>
              <TextInput
                placeholder="Search title, company, or keyword"
                placeholderTextColor={Colors.textMuted}
                value={searchText}
                onChangeText={onSearchChange}
                style={styles.filterInput}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              <TextInput
                placeholder="Start typing a state or Remote"
                placeholderTextColor={Colors.textMuted}
                value={filterLocation}
                onChangeText={onLocationChange}
                style={styles.filterInput}
              />
              {locationSuggestions.length > 0 && (
                <View style={styles.locationSuggestionBox}>
                  {locationSuggestions.map((state) => (
                    <TouchableOpacity
                      key={state}
                      style={styles.locationSuggestionItem}
                      onPress={() => onLocationChange(state)}
                    >
                      <Text style={styles.locationSuggestionText}>{state}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Skills</Text>
              <FilterChips
                options={SKILL_OPTIONS}
                selected={selectedSkills}
                onChange={onSkillsChange}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Minimum Pay</Text>
              <TextInput
                placeholder="Example: 15 or 40000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={minPay}
                onChangeText={onMinPayChange}
                style={styles.filterInput}
              />
            </View>
          </ScrollView>

          <View style={styles.filterFooter}>
            <TouchableOpacity style={styles.filterResetButton} onPress={onReset}>
              <Text style={styles.filterResetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterApplyButton} onPress={onApply}>
              <Text style={styles.filterApplyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  filterSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: "88%",
  },
  filterHandle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.outline,
    alignSelf: "center",
    marginBottom: 18,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  filterTitle: { color: Colors.text, fontSize: 26, fontWeight: "800" },
  filterSubtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  filterCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: { marginBottom: 24 },
  filterSectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  locationSuggestionBox: {
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 14,
    overflow: "hidden",
  },
  locationSuggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  locationSuggestionText: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  filterChipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  filterChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { color: Colors.textMuted, fontSize: 14, fontWeight: "600" },
  filterChipTextSelected: { color: Colors.text },
  filterFooter: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  filterResetText: { color: Colors.text, fontSize: 15, fontWeight: "700" },
  filterApplyButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  filterApplyText: { color: Colors.text, fontSize: 15, fontWeight: "800" },
});
