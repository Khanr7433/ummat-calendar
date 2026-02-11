import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";
import { formatReminderTime, getAlertLabel } from "../../utils/reminderUtils";

export default function ReminderItem({ item, onEdit, onDelete }) {
  const isExpired = new Date(item.date) < new Date();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onEdit(item)}
      style={[styles.container, isExpired && styles.expiredContainer]}
    >
      <View style={styles.iconColumn}>
        <View style={[styles.iconBadge, isExpired && styles.expiredIconBadge]}>
          <Ionicons
            name={isExpired ? "alert" : "notifications"}
            size={22}
            color={isExpired ? COLORS.textSecondary : COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.contentColumn}>
        <Text style={[styles.title, isExpired && styles.expiredText]}>
          {item.title}
        </Text>

        {item.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.timeTag}>
            <Ionicons name="time" size={12} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>{formatReminderTime(item.date)}</Text>
          </View>

          {isExpired && (
            <View style={styles.expiredTag}>
              <Text style={styles.expiredLabel}>Expired</Text>
            </View>
          )}
        </View>

        {/* Display Alert Summaries */}
        {item.alerts && item.alerts.length > 0 && !isExpired && (
          <View style={styles.alertsRow}>
            {item.alerts.map((alert, index) => {
              const label = getAlertLabel(alert);
              return (
                <View key={index} style={styles.alertBadge}>
                  <Text style={styles.alertBadgeText}>{label}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        activeOpacity={0.6}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    // Modern Box Shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  expiredContainer: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  iconColumn: {
    marginRight: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryBg, // Light Indigo
    justifyContent: "center",
    alignItems: "center",
  },
  expiredIconBadge: {
    backgroundColor: COLORS.border,
  },

  contentColumn: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...TOPOGRAPHY.cardTitle,
    marginBottom: 4,
  },
  description: {
    ...TOPOGRAPHY.cardSubtitle,
    marginBottom: 8,
  },
  expiredText: {
    color: COLORS.textTertiary,
    textDecorationLine: "line-through",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.inputBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  timeText: {
    ...TOPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  expiredTag: {
    backgroundColor: COLORS.dangerBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  expiredLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.danger,
    textTransform: "uppercase",
  },

  deleteButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.dangerBg,
    marginLeft: 12,
  },

  alertsRow: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  alertBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.primaryBorder,
  },
  alertBadgeText: {
    fontSize: 10,
    color: "#34495E", // Keep specific dark blue or use textSecondary
    fontWeight: "500",
  },
});
