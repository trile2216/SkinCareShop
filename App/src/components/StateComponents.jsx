import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export const LoadingState = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#4caf50" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

export const ErrorState = ({ message = "Something went wrong" }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

export const EmptyState = ({ 
  message = "No items found",
  icon = "📦",
  subMessage
}) => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyText}>{message}</Text>
    {subMessage && <Text style={styles.emptySubText}>{subMessage}</Text>}
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#757575",
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
});
