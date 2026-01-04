import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            numColumns={2}
            key={2}
            columnWrapperStyle={styles.columnWrapper}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.modalGridItem,
                  index === currentMonthIndex && styles.selectedGridItem,
                ]}
                onPress={() => onSelectMonth(index)}
              >
                <Text
                  style={[
                    styles.modalGridItemText,
                    index === currentMonthIndex && styles.selectedGridItemText,
                  ]}
                >
                  {item.monthName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a252f",
  },
  closeIcon: {
    padding: 8,
  },
  closeIconText: {
    fontSize: 20,
    color: "#95a5a6",
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalGridItem: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedGridItem: {
    backgroundColor: "#2c3e50",
  },
  modalGridItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7f8c8d",
  },
  selectedGridItemText: {
    color: "white",
  },
});

export default MonthSelectorModal;
