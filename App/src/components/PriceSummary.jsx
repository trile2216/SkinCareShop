import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const PriceSummary = ({ totalItems, totalPrice, onCheckout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Items ({totalItems})</Text>
        <Text style={styles.value}>${totalPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, totalItems === 0 && styles.checkoutButtonDisabled]}
        onPress={onCheckout}
        disabled={totalItems === 0}
      >
        <Text style={styles.checkoutButtonText}>
          {totalItems === 0 ? "Cart is Empty" : "Proceed to Checkout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#616161",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  checkoutButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default PriceSummary;
