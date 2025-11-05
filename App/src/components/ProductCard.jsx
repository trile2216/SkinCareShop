import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../provider/CartProvider";

const ProductCard = ({ item, onPress, onFavoritePress, isFavorite }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const inCart = isInCart(item.id);
  const quantity = getItemQuantity(item.id);

  const renderBadge = (text, backgroundColor = "#e3f2fd", textColor = "#1976d2") => (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{text}</Text>
    </View>
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.sale > 0 && (
          <View style={styles.saleRibbon}>
            <Text style={styles.saleText}>-{Math.round(item.sale)}%</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          {item.sale > 0 && (
            <Text style={styles.originalPrice}>
              ${(item.price / (1 - item.sale / 100)).toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          {renderBadge(item.gender || "—", "#e8f5e8", "#2e7d32")}
          {renderBadge(item.brandName || "—", "#fff3e0", "#e65100")}
        </View>

        <View style={styles.metaContainer}>
          {item.size && renderBadge(`${item.size}ml`, "#f3e5f5", "#7b1fa2")}
          {item.categoryName && renderBadge(item.categoryName, "#e3f2fd", "#1976d2")}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.cartButton, inCart && styles.cartButtonActive]}
            onPress={handleAddToCart}
          >
            <Text style={[styles.cartButtonText, inCart && styles.cartButtonTextActive]}>
              {inCart ? `🛒 In Cart (${quantity})` : "🛒 Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}
          >
            <Ionicons
              name={isFavorite ? "heart-circle" : "heart-circle-outline"}
              size={24}
              color={isFavorite ? "#e91e63" : "#757575"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    flex: 1,
    minHeight: 320,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  saleRibbon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff5722",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  saleText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
    display: "flex",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 6,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 11,
    color: "#757575",
    textDecorationLine: "line-through",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 4,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  cartButtonActive: {
    backgroundColor: "#2e7d32",
  },
  cartButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  cartButtonTextActive: {
    color: "#ffffff",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonActive: {
    backgroundColor: "#ffebee",
  },
});

export default ProductCard;
