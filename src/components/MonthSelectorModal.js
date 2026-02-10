import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";
import { COLORS } from "../constants/colors";

const MonthSelectorModal = ({
  visible,
  onClose,
  data,
  currentMonthIndex,
  onSelectMonth,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Jump to Month</Text>
              <Text style={styles.subtitle}>Select a month to view</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={12}
            >
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            numColumns={2}
            key={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              const isSelected = index === currentMonthIndex;
              return (
                <TouchableOpacity
                  style={[
                    styles.gridItem,
                    isSelected && styles.gridItemSelected,
                  ]}
                  onPress={() => onSelectMonth(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.gridItemText,
                      isSelected && styles.gridItemTextSelected,
                    ]}
                  >
                    {item.monthName}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.white}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Darker, cleaner dim
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,
    maxHeight: "80%",

    // Elevation (Android) & Shadow (iOS)
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    ...TOPOGRAPHY.h2,
    marginBottom: 4,
  },
  subtitle: {
    ...TOPOGRAPHY.bodySecondary,
  },
  closeButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },

  listContent: {
    paddingBottom: 8,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "transparent",
  },
  gridItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  gridItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  gridItemTextSelected: {
    color: COLORS.white,
  },
  checkIcon: {
    marginLeft: 8,
  },
});

export default MonthSelectorModal;
