import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import useCart from "../hooks/useCart";
import { instance } from "../lib/axios";
import shippingFeeService from "../services/api.shippingFee";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutDetails() {
  const navigation = useNavigation();
  const customerId = useSelector((state) => state.user.customerId);
  const { cartItems, totalPrice, clearCart, totalItems } = useCart();



  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    paymentMethod: "",
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await shippingFeeService.getAllCities();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        Alert.alert("Error", "Failed to load cities");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.city) {
      const fetchDistricts = async () => {
        try {
          setLoading(true);
          const data = await shippingFeeService.getDistrictsByCity(
            formData.city
          );
          // Handle empty array or null response
          setDistricts(data && Array.isArray(data) ? data : []);
          setFormData((prev) => ({ ...prev, state: "" }));
          setShippingFee(0);
        } catch (error) {
          console.error("Error fetching districts:", error);
          // Set empty districts instead of showing alert
          setDistricts([]);
          setFormData((prev) => ({ ...prev, state: "" }));
          setShippingFee(0);
        } finally {
          setLoading(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setShippingFee(0);
    }
  }, [formData.city]);

  useEffect(() => {
    if (formData.city && formData.state) {
      const fetchShippingFee = async () => {
        try {
          setLoading(true);
          const data = await shippingFeeService.getShippingFee(
            formData.city,
            formData.state
          );
          // Use default fee of 15 if not available
          setShippingFee(Number(data.fee) || 15);
        } catch (error) {
          console.error("Error fetching shipping fee:", error);
          // Fallback to default shipping fee
          setShippingFee(15);
        } finally {
          setLoading(false);
        }
      };
      fetchShippingFee();
    } else {
      setShippingFee(0);
    }
  }, [formData.city, formData.state]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty. Please add items before checkout.");
      return false;
    }

    if (!formData.firstName.trim()) {
      Alert.alert("Error", "First Name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Error", "Last Name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return false;
    }
    if (!formData.street.trim()) {
      Alert.alert("Error", "Street Address is required");
      return false;
    }
    if (!formData.city) {
      Alert.alert("Error", "City is required");
      return false;
    }
    if (!formData.state) {
      Alert.alert("Error", "District is required");
      return false;
    }
    if (!formData.paymentMethod) {
      Alert.alert("Error", "Payment method is required");
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      "Confirm Order",
      "Are you sure? Your order cannot be changed once placed.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setSubmitting(true);

              // Verify cart is not empty
              if (!cartItems || cartItems.length === 0) {
                Alert.alert("Error", "Cart is empty. Cannot submit order.");
                setSubmitting(false);
                return;
              }

              // STEP 1: Sync cart items to session (required for backend validation)
              console.log("STEP 1: Syncing cart items to backend session...");
              try {
                for (const item of cartItems) {
                  const syncRes = await instance.post("/cart/add", {
                    productId: parseInt(String(item.id), 10),
                    quantity: parseInt(String(item.quantity), 10),
                  });
                  console.log(`Cart sync - ProductId: ${item.id}, Status: ${syncRes.status}, Response:`, syncRes.data);
                }
                console.log("Cart sync completed");
              } catch (syncError) {
                console.warn("Cart sync error:", syncError.response?.status, syncError.message);
                // Continue anyway - backend might still work
              }

              // STEP 2: Prepare order data
              console.log("STEP 2: Preparing order data...");
              
              // Convert payment method string to enum value
              const paymentMethodMap = {
                COD: 0,
                VNPay: 1,
              };
              
              const customerIdNum = parseInt(String(customerId), 10);
              if (isNaN(customerIdNum) || customerIdNum <= 0) {
                Alert.alert("Error", "Invalid customer ID");
                setSubmitting(false);
                return;
              }

              const orderData = {
                customerId: customerIdNum,
                cartItems: cartItems.map((item) => {
                  return {
                    productId: parseInt(String(item.id), 10),
                    productImage: item.image || item.uri || "",
                    productName: item.name || "",
                    productPrice: parseFloat(String(item.price)),
                    productSale: parseFloat(String(item.sale)) || 0,
                    quantity: parseInt(String(item.quantity), 10),
                  };
                }),
                totalPrice: parseFloat(String(totalPrice)),
                shippingFee: parseFloat(String(shippingFee)),
                paymentMethod: paymentMethodMap[formData.paymentMethod],
                street: formData.street,
                city: String(formData.city),
                state: String(formData.state),
              };

              console.log("=== ORDER REQUEST DEBUG ===");
              console.log("CustomerId:", customerId);
              console.log("Request Body:", JSON.stringify(orderData, null, 2));
              console.log("=== END DEBUG ===");

              // STEP 3: Submit order
              console.log("STEP 3: Submitting order...");
              const response = await instance.post(
                "/checkout/process-payment",
                orderData
              );

              if (formData.paymentMethod === "VNPay") {
                if (response.data.paymentUrl) {
                  Alert.alert(
                    "Payment",
                    "Redirecting to VNPay gateway...",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          clearCart();
                          navigation.navigate("OrderSuccess", {
                            orderData: response.data,
                            paymentMethod: formData.paymentMethod,
                            shippingFee: Number(shippingFee) || 0,
                          });
                        },
                      },
                    ]
                  );
                }
              } else {
                // COD payment
                clearCart();
                navigation.navigate("OrderSuccess", {
                  orderData: response.data,
                  paymentMethod: formData.paymentMethod,
                  shippingFee: Number(shippingFee) || 0,
                });
              }
            } catch (error) {
              console.error("=== ORDER ERROR ===");
              console.error("Error object:", error);
              console.error("Response status:", error.response?.status);
              console.error("Response data:", error.response?.data);
              console.error("Request URL:", error.config?.url);
              console.error("Request method:", error.config?.method);
              console.error("Error full:", JSON.stringify(error, null, 2));
              console.error("=== END ERROR ===");
              
              // Try to fetch orders to see if order was partially created
              try {
                const ordersRes = await instance.get(`/order/customer/${customerId}`);
                console.log("Recent orders for customer:", ordersRes.data);
              } catch (fetchErr) {
                console.warn("Could not fetch customer orders");
              }
              
              Alert.alert(
                "Error",
                error.response?.data?.message || error.message || "Failed to place order"
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const selectedCityName =
    cities.find((c) => c.id == formData.city)?.name || "Select City";
  const selectedDistrictName =
    districts.find((d) => d.id == formData.state)?.name || "Select District";

  const safeTotalPrice = Number(totalPrice) || 0;
  const safeShippingFee = Number(shippingFee) || 0;
  const totalAmount = safeTotalPrice + safeShippingFee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressNumber}>1</Text>
            </View>
            <Text style={styles.progressLabel}>Cart</Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={[styles.progressCircle, styles.progressCircleActive]}>
              <Text style={styles.progressNumber}>2</Text>
            </View>
            <Text style={[styles.progressLabel, { color: "#4caf50" }]}>
              Details
            </Text>
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressStep}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressNumber}>3</Text>
            </View>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Checkout Details</Text>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(value) =>
                  handleInputChange("firstName", value)
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Phone <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Street Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter street address"
                value={formData.street}
                onChangeText={(value) => handleInputChange("street", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerButton]}
                onPress={() => setShowCityPicker(true)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !formData.city && { color: "#999" },
                  ]}
                >
                  {selectedCityName}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                District <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.pickerButton,
                  !formData.city && styles.pickerButtonDisabled,
                ]}
                onPress={() =>
                  formData.city && setShowDistrictPicker(true)
                }
                disabled={!formData.city}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !formData.state && { color: "#999" },
                    !formData.city && { color: "#bbb" },
                  ]}
                >
                  {selectedDistrictName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shipping Fee Display */}
          {formData.city && formData.state && (
            <View style={styles.shippingFeeContainer}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Subtotal:</Text>
                <Text style={styles.feeValue}>${(Number(totalPrice) || 0).toFixed(2)}</Text>
              </View>
              {loading ? (
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Shipping Fee:</Text>
                  <ActivityIndicator size="small" color="#667eea" />
                </View>
              ) : (
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Shipping Fee:</Text>
                  <Text style={styles.feeValue}>${(Number(shippingFee) || 0).toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.feeDivider} />
              <View style={styles.feeRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${(totalAmount).toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Payment Method <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.radioOption,
                formData.paymentMethod === "COD" && styles.radioOptionSelected,
              ]}
              onPress={() => handleInputChange("paymentMethod", "COD")}
            >
              <View
                style={[
                  styles.radioButton,
                  formData.paymentMethod === "COD" &&
                    styles.radioButtonSelected,
                ]}
              />
              <Text style={styles.radioLabel}>
                COD (Cash on Delivery)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioOption,
                formData.paymentMethod === "VNPay" &&
                  styles.radioOptionSelected,
              ]}
              onPress={() => handleInputChange("paymentMethod", "VNPay")}
            >
              <View
                style={[
                  styles.radioButton,
                  formData.paymentMethod === "VNPay" &&
                    styles.radioButtonSelected,
                ]}
              />
              <Text style={styles.radioLabel}>VNPay</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                {cartItems.length} item(s) - ${(Number(totalPrice) || 0).toFixed(2)}
              </Text>
              {formData.city && formData.state && (
                <Text style={styles.summaryText}>
                  Shipping - ${(Number(shippingFee) || 0).toFixed(2)}
                </Text>
              )}
              <Text style={styles.summaryTotal}>
                Total: ${(totalAmount).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitOrder}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Place Order</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    handleInputChange("city", item.id);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* District Picker Modal */}
      <Modal
        visible={showDistrictPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDistrictPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select District</Text>
              <TouchableOpacity onPress={() => setShowDistrictPicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={districts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    handleInputChange("state", item.id);
                    setShowDistrictPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    color: "#999",
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
  },
  progressLine: {
    flex: 0.6,
    height: 2,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#d32f2f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  pickerButton: {
    justifyContent: "center",
  },
  pickerButtonDisabled: {
    backgroundColor: "#f5f5f5",
  },
  pickerText: {
    fontSize: 14,
    color: "#333",
  },
  shippingFeeContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: "#616161",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  feeDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
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
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  radioOptionSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  summaryBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  summaryText: {
    fontSize: 13,
    color: "#616161",
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButtonText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  modalCloseButton: {
    fontSize: 20,
    color: "#999",
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#333",
  },
});
