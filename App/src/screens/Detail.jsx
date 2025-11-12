import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { 
  Text, 
  Image, 
  ScrollView, 
  View, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useStorageContext } from "../provider/StorageProvider";
import useCart from "../hooks/useCart";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Detail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;
  const product = params?.product;

  const {
    addStorageData: addToFavorites,
    removeStorageData: removeFromFavorites,
    storageData: favorites,
  } = useStorageContext();

  const { 
    addToCart, 
    isInCart, 
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity 
  } = useCart();

  if (!product) return null;

  const isFavorite = favorites?.some((fav) => fav.id === product.id);
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const formatVND = (cost) => {
    return (cost * 26000).toLocaleString("vi-VN") + " VND";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {/* Back button (added) */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {product.sale > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round(product.sale)}%
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
              {product.sale > 0 && (
                <Text style={styles.originalPrice}>
                  ${(product.price / (1 - product.sale / 100)).toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Brand:</Text>
              <Text style={styles.metaValue}>{product.brandName || "—"}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Category:</Text>
              <Text style={styles.metaValue}>{product.categoryName || "—"}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Gender:</Text>
              <Text style={styles.metaValue}>{product.gender || "Unisex"}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Size:</Text>
              <Text style={styles.metaValue}>{product.size ? `${product.size}ml` : "—"}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Stock:</Text>
              <Text style={[styles.metaValue, product.stock === 0 && { color: "#d32f2f" }]}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {product.status ? "✓ Active" : "✗ Inactive"}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Ingredients Section */}
          {product.ingredient && (
            <View style={styles.ingredientSection}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientText}>{product.ingredient}</Text>
            </View>
          )}

          {/* Cart Section */}
          {inCart ? (
            <View style={styles.cartSection}>
              <Text style={styles.inCartText}>✓ In Cart</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(product.id)}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(product.id)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => addToCart(product)}
            >
              <Text style={styles.addToCartButtonText}>🛒 Add to Cart</Text>
            </TouchableOpacity>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={() => {
              if (isFavorite) {
                removeFromFavorites(product.id);
              } else {
                addToFavorites(product);
              }
            }}
          >
            <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
              {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "relative",
    width: width,
    height: width * 0.8, // 4:3.2 aspect ratio
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ff5722",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 8,
    lineHeight: 36,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: "#757575",
    textDecorationLine: "line-through",
  },
  priceSubtext: {
    fontSize: 16,
    color: "#757575",
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    marginRight: 12,
    minWidth: 80,
  },
  metaValue: {
    fontSize: 16,
    color: "#616161",
    flex: 1,
  },
  genderBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976d2",
  },
  statusBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
  },
  colorTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  colorTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  colorTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 22,
  },
  ingredientSection: {
    marginBottom: 24,
  },
  ingredientText: {
    fontSize: 13,
    color: "#616161",
    lineHeight: 20,
  },
  cartSection: {
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  inCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  quantity: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginHorizontal: 32,
    minWidth: 40,
    textAlign: "center",
  },
  addToCartButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  favoriteButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButtonActive: {
    backgroundColor: "#ffebee",
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
  favoriteButtonTextActive: {
    color: "#e91e63",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 12,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Detail;
