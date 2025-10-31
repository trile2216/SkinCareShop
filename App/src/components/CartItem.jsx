import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useCart } from "../provider/CartProvider";

const CartItem = ({ item, onPress }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const subtotal = item.price * item.quantity;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.brand}>{item.brand}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.subtotal}>
            Subtotal: ${subtotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decreaseQuantity(item.id)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => increaseQuantity(item.id)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  brand: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  subtotal: {
    fontSize: 13,
    color: "#757575",
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#d32f2f",
  },
});

export default CartItem;
