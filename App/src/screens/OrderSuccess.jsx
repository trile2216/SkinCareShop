import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSuccess() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cartItems, totalPrice, clearCart } = useCart();

  const orderData = route.params?.orderData || {};
  const paymentMethod = route.params?.paymentMethod || "COD";
  const shippingFee = route.params?.shippingFee || 0;

  const safeTotalPrice = Number(totalPrice) || 0;
  const safeShippingFee = Number(shippingFee) || 0;
  const totalAmount = safeTotalPrice + safeShippingFee;

  useEffect(() => {
    // Clear cart after page renders so items are visible first
    // Don't clear immediately to preserve cartItems display
  }, []);

  const handleBackToHome = () => {
    clearCart();
    // Navigate to Home screen which is nested inside Tabs navigator
    navigation.navigate("Tabs", { screen: "Home" });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemBrand}>{item.brandName || "N/A"}</Text>
      </View>
      <View style={styles.itemPriceSection}>
        <Text style={styles.itemQuantity}>x{Number(item.quantity) || 0}</Text>
        <Text style={styles.itemTotal}>
          ${( (Number(item.price) || 0) * (Number(item.quantity) || 0) ).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.progressCircleActive]}>
              <Text style={styles.progressNumber}>1</Text>
            </View>
            <Text style={styles.progressLabel}>Cart</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.progressCircleActive]}>
              <Text style={styles.progressNumber}>2</Text>
            </View>
            <Text style={styles.progressLabel}>Details</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.progressCircleActive]}>
              <Text style={styles.progressNumber}>3</Text>
            </View>
            <Text style={[styles.progressLabel, { color: "#4caf50" }]}>
              Complete
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successMessage}>
              Your order has been placed and is being processed
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.statusBox}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>🔄 Processing</Text>
              </View>
              <Text style={styles.statusDescription}>
                Your order is being confirmed. You will receive an email shortly.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ordered Items</Text>
              <Text style={styles.itemCount}>
                {cartItems.length} item(s)
              </Text>
            </View>

            <View style={styles.itemsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Product</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Qty</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>Price</Text>
              </View>

              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCartItem}
                scrollEnabled={false}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Total</Text>
            <View style={styles.totalBox}>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>${safeTotalPrice.toFixed(2)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping Fee</Text>
                <Text style={styles.totalValue}>${safeShippingFee.toFixed(2)}</Text>
              </View>

              <View style={styles.totalDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalMainLabel}>Total</Text>
                <Text style={styles.totalMainValue}>
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentBox}>
              <Text style={styles.paymentMethod}>
                {paymentMethod === "COD"
                  ? "💳 Cash on Delivery (COD)"
                  : "🏦 VNPay"}
              </Text>
              <Text style={styles.paymentDescription}>
                {paymentMethod === "COD"
                  ? "You will pay upon delivery"
                  : "Payment processed through VNPay"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Next?</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  You will receive an order confirmation email
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>
                  Your order will be prepared and shipped soon
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  You can track your order in your account
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.homeButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  progressCircleActive: {
    backgroundColor: "#4caf50",
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
  },
  progressLine: {
    flex: 0.6,
    height: 2,
    backgroundColor: "#4caf50",
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  successContainer: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#558b2f",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  itemCount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  statusBadge: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e65100",
  },
  statusDescription: {
    fontSize: 13,
    color: "#616161",
    lineHeight: 18,
  },
  itemsTable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#e0e0e0",
    borderBottomColor: "#e0e0e0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "600",
    color: "#616161",
    textTransform: "uppercase",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  itemDetails: {
    flex: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 11,
    color: "#757575",
  },
  itemPriceSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2e7d32",
  },
  totalBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: "#616161",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  totalMainLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  totalMainValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  paymentBox: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
  },
  paymentMethod: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1565c0",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: "#0d47a1",
  },
  stepsContainer: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4caf50",
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    marginRight: 12,
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#616161",
    lineHeight: 18,
    paddingTop: 4,
  },
  homeButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
