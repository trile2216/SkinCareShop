import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { instance } from "../lib/axios";
import { useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();
  const customerId = useSelector((state) => state.user.customerId);
  const token = useSelector((state) => state.user.token);
  const navigation = useNavigation();

  useEffect(() => {
    // refresh when screen focused or customerId/token changes
    if (isFocused) fetchOrderHistory();
  }, [isFocused, customerId, token]);

  const fetchOrderHistory = async () => {
    // if user not logged in, show empty and return
    if (!customerId) {
      setOrders([]);
      return;
    }

    // normal fetch
    setLoading(true);
    try {
      if (!instance) throw new Error("axios instance is not defined (check App/src/lib/axios export)");
      const url = `/order/customer/${customerId}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await instance.get(url, { headers });

      if (response && (response.status === 200 || response.status === 204)) {
        // backend may return { data: [...] } or [...] directly
        const payload = response.data ?? [];
        const data = payload?.data ?? payload;
        setOrders(Array.isArray(data) ? data : data ? [data] : []);
      } else {
        Alert.alert("Error", "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      Alert.alert("Error", err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderHistory();
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((cur) => (cur === orderId ? null : orderId));
  };

  const formatCurrency = (amount) => {
    try {
      if (typeof Intl !== "undefined" && Intl.NumberFormat) {
        const locale = Platform.OS === "ios" ? "en-US" : "en-US";
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
        }).format(amount || 0);
      }
    } catch (e) {}
    return `$${(amount || 0).toFixed(2)}`;
  };

  const renderOrderItem = ({ item }) => {
    const id = item.id ?? item.orderId ?? item.orderID ?? item.orderId;
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{id}</Text>
            <Text style={styles.orderDate}>{item.orderDate}</Text>
          </View>
          <View style={styles.orderSummary}>
            <Text style={styles.price}>{formatCurrency(item.totalPrice)}</Text>
            <Text style={styles.shipping}>Ship: {formatCurrency(item.shippingFee)}</Text>
            <Text style={[styles.status, styles.statusText]}>{item.status}</Text>
            <TouchableOpacity style={styles.viewBtn} onPress={() => toggleOrderDetails(id)}>
              <Text style={styles.viewBtnText}>{expandedOrder === id ? "Hide" : "View"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {expandedOrder === id && (
          <View style={styles.details}>
            {(item.orderItems || []).map((it) => (
              <View key={it.id ?? `${it.productId || it.productID || Math.random()}`} style={styles.detailRow}>
                <Text style={styles.prodName}>{it.productName || it.name || "Product"}</Text>
                <Text style={styles.qty}>x{it.quantity}</Text>
                <Text style={styles.unit}>{formatCurrency(it.unitPrice)}</Text>
                <Text style={styles.subtotal}>{formatCurrency((it.quantity || 0) * (it.unitPrice || 0))}</Text>
              </View>
            ))}
            <View style={styles.totals}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(item.totalPrice)}</Text>
            </View>
            <View style={styles.totals}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={styles.totalValue}>{formatCurrency(item.shippingFee)}</Text>
            </View>
            <View style={styles.totals}>
              <Text style={[styles.totalLabel, styles.finalLabel]}>Total:</Text>
              <Text style={[styles.totalValue, styles.finalValue]}>
                {formatCurrency((item.totalPrice || 0) + (item.shippingFee || 0))}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Show login prompt when no customerId
  if (!customerId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Orders</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử đơn hàng.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      {loading && orders.length === 0 ? (
        <ActivityIndicator size="large" color="#e11d48" style={{ marginTop: 20 }} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id ?? item.orderId ?? Math.random())}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 12, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontSize: 16, fontWeight: "600" },
  orderDate: { fontSize: 12, color: "#6b7280" },
  orderSummary: { alignItems: "flex-end" },
  price: { fontSize: 16, fontWeight: "700", color: "#b91c1c" },
  shipping: { fontSize: 12, color: "#6b7280" },
  status: { marginTop: 6 },
  statusText: { fontSize: 12, color: "#111827" },
  viewBtn: { marginTop: 8, backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  viewBtnText: { color: "#fff", fontWeight: "600" },
  details: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 10 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  prodName: { flex: 1, fontSize: 13 },
  qty: { width: 36, textAlign: "center" },
  unit: { width: 90, textAlign: "right" },
  subtotal: { width: 90, textAlign: "right" },
  totals: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  totalLabel: { color: "#374151" },
  totalValue: { fontWeight: "700" },
  finalLabel: { fontSize: 15 },
  finalValue: { fontSize: 15, color: "#b91c1c" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 40 },
  emptyText: { color: "#6b7280", textAlign: "center", paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backButton: { paddingVertical: 6, paddingHorizontal: 10, marginRight: 8, backgroundColor: "#fff", borderRadius: 6, borderWidth: 1, borderColor: "#e5e7eb" },
  backButtonText: { color: "#374151", fontWeight: "600" },
});