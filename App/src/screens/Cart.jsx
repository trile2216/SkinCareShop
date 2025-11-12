import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";
import PriceSummary from "../components/PriceSummary";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { LoadingState, EmptyState } from "../components/StateComponents";

const ITEMS_PER_PAGE = 10;

export default function Cart() {
  const navigation = useNavigation();
  const {
    cartItems,
    loading,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [sortBy, setSortBy] = useState("name-asc");

  // Filter items based on search query and sort
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      let result = [...cartItems];
      
      // Sorting
      const sortMap = {
        "name-asc": (a, b) => a.name.localeCompare(b.name),
        "name-desc": (a, b) => b.name.localeCompare(a.name),
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
      };

      if (sortMap[sortBy]) {
        result.sort(sortMap[sortBy]);
      }

      return result;
    }

    const query = searchQuery.toLowerCase();
    let result = cartItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.brandName?.toLowerCase().includes(query)
    );

    // Sorting
    const sortMap = {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    };

    if (sortMap[sortBy]) {
      result.sort(sortMap[sortBy]);
    }

    return result;
  }, [searchQuery, cartItems, sortBy]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(0, displayedItems);
  }, [filteredItems, displayedItems]);

  // Handle pagination - load more items
  const handleLoadMore = () => {
    if (displayedItems < filteredItems.length) {
      setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (totalItems === 0) return;

    // Navigate to the Checkout flow (Checkout -> CheckoutDetails -> OrderSuccess)
    navigation.navigate("Checkout");
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (totalItems === 0) return;

    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearCart(),
        },
      ]
    );
  };

  // Navigate to detail screen
  const handleItemPress = (item) => {
    navigation.navigate("Detail", { product: item });
  };

  // Render header with search and clear button
  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{totalItems}</Text>
        </View>
      </View>

      {totalItems > 0 && (
        <View style={styles.clearButtonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>🗑️ Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchQuery && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {filteredItems.length === 0
              ? "No items match your search"
              : `Found ${filteredItems.length} item(s)`}
          </Text>
        </View>
      )}
    </View>
  );

  // Render footer with price summary
  const renderFooter = () => {
    if (filteredItems.length === 0) return null;

    return (
      <View style={styles.footerContainer}>
        {displayedItems < filteredItems.length && (
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>
              Showing {displayedItems} of {filteredItems.length} items
            </Text>
          </View>
        )}
        <PriceSummary
          totalItems={totalItems}
          totalPrice={totalPrice}
          onCheckout={handleCheckout}
        />
      </View>
    );
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search in cart..."
          onClear={() => setSearchQuery("")}
        />
        {renderHeader()}
        <EmptyState
          icon="🛒"
          message="Your cart is empty"
          subMessage="Add some items to get started!"
        />
      </View>
    );
  }

  // No search results
  if (filteredItems.length === 0) {
    const brands = [...new Set(cartItems?.map((p) => p.brandName).filter(Boolean))];

    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search in cart..."
          onClear={() => setSearchQuery("")}
        />
        <FilterBar
          onFilterChange={() => {}}
          brands={brands}
          categories={[]}
          genders={[]}
          currentFilters={{}}
          onSortChange={setSortBy}
          currentSort={sortBy}
        />
        {renderHeader()}
        <EmptyState
          icon="🔍"
          message="No items found"
          subMessage={`Try searching for something else`}
        />
      </View>
    );
  }

  const brands = [...new Set(cartItems?.map((p) => p.brandName).filter(Boolean))];

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search in cart..."
        onClear={() => setSearchQuery("")}
      />
      <FilterBar
        onFilterChange={() => {}}
        brands={brands}
        categories={[]}
        genders={[]}
        currentFilters={{}}
        onSortChange={setSortBy}
        currentSort={sortBy}
      />
      <FlatList
        data={paginatedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem item={item} onPress={() => handleItemPress(item)} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 40,
  },
  listContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
    paddingLeft: 10,
  },
  headerBadge: {
    backgroundColor: "#4caf50",
    borderRadius: 20,
    minWidth: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingRight: 10,
  },
  headerBadgeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButtonContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "600",
  },
  searchResultsContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  searchResultsText: {
    fontSize: 14,
    color: "#1565c0",
    textAlign: "center",
  },
  footerContainer: {
    marginTop: 16,
  },
  loadMoreContainer: {
    backgroundColor: "#fff3e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  loadMoreText: {
    fontSize: 14,
    color: "#e65100",
    textAlign: "center",
  },
});
