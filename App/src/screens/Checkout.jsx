import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
  const navigation = useNavigation();
  const { cartItems, totalPrice, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyMessage}>
            Add some items before proceeding to checkout
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleProceedToCheckout = () => {
    if (totalItems === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart");
      return;
    }
    navigation.navigate("CheckoutDetails");
  };

  const renderCartItem = ({ item }) => {
    const safePrice = Number(item.price) || 0;
    const safeQty = Number(item.quantity) || 1;
    const itemTotal = safePrice * safeQty;

    return (
      <View style={styles.cartItemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemBrand}>{item.brandName || "N/A"}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>${safePrice.toFixed(2)}</Text>
            <Text style={styles.itemQuantity}>x{safeQty}</Text>
          </View>
          <Text style={styles.itemTotal}>
            ${itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleActive]}>
            <Text style={styles.progressNumber}>1</Text>
          </View>
          <Text style={styles.progressLabel}>Cart</Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumberInactive}>2</Text>
          </View>
          <Text style={styles.progressLabelInactive}>Details</Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumberInactive}>3</Text>
          </View>
          <Text style={styles.progressLabelInactive}>Complete</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Shopping Cart</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerSection}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems || 0} items)</Text>
          <Text style={styles.summaryValue}>${(Number(totalPrice) || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${(Number(totalPrice) || 0).toFixed(2)}</Text>
        </View>

        <Text style={styles.noteText}>
          Shipping fee will be calculated in the next step based on your location
        </Text>

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToCheckout}
        >
          <Text style={styles.proceedButtonText}>
            Proceed to Checkout Details →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.continueShoppingText}>← Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  progressCircleActive: {
    backgroundColor: "#4caf50",
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  progressNumberInactive: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4caf50",
  },
  progressLabelInactive: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  progressLine: {
    flex: 0.8,
    height: 2,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 8,
  },
  cartItemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#616161",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  footerSection: {
    marginTop: 16,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#616161",
  },
  summaryValue: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  proceedButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  continueShoppingButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  continueShoppingText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginVertical: 12,
    textAlign: "center",
  },
});
