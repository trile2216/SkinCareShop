import React, { useState, useMemo } from "react";
import { 
  FlatList, 
  View, 
  StyleSheet,
  Text,
} from "react-native";
import { useAppContext } from "../provider/AppProvider";
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from "../provider/StorageProvider";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { LoadingState, EmptyState } from "../components/StateComponents";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const { books: products } = useAppContext();
  const navigation = useNavigation();
  const {
    addStorageData: addToFavorites,
    removeStorageData: removeFromFavorites,
    storageData: favorites,
  } = useStorageContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("name-asc");

  const navigateToDetail = (product) => {
    navigation.navigate("Detail", { product });
  };

  const isFavorite = (itemId) => favorites?.some((fav) => fav.id === itemId);

  const handleFavoriteToggle = (item) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  // Filter items based on search query and filters
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.brandName?.toLowerCase().includes(query) ||
          item.categoryName?.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (filters.brands?.length > 0) {
      result = result.filter((item) =>
        filters.brands.includes(item.brandName)
      );
    }

    // Category filter
    if (filters.categories?.length > 0) {
      result = result.filter((item) =>
        filters.categories.includes(item.categoryName)
      );
    }

    // Gender filter
    if (filters.genders?.length > 0) {
      result = result.filter((item) =>
        filters.genders.includes(item.gender)
      );
    }

    // Sorting
    const sortMap = {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "sale-desc": (a, b) => (b.sale || 0) - (a.sale || 0),
    };

    if (sortMap[sortBy]) {
      result.sort(sortMap[sortBy]);
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  // Paginate items
  const paginatedProducts = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) {
      return [];
    }
    return filteredProducts.slice(0, displayedItems);
  }, [filteredProducts, displayedItems]);

  // Handle pagination - load more items
  const handleLoadMore = () => {
    if (displayedItems < filteredProducts.length) {
      setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
    }
  };

  // Render header with search
  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
      </View>

      {searchQuery && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {filteredProducts.length === 0
              ? "No products match your search"
              : `Found ${filteredProducts.length} product(s)`}
          </Text>
        </View>
      )}
    </View>
  );

  // Render footer for pagination
  const renderFooter = () => {
    if (displayedItems < filteredProducts.length) {
      return (
        <View style={styles.loadMoreContainer}>
          <Text style={styles.loadMoreText}>
            Showing {displayedItems} of {filteredProducts.length} products
          </Text>
          <Text style={styles.loadMoreSubText}>Scroll down to load more</Text>
        </View>
      );
    }
    return null;
  };

  // Loading state
  if (!products || products.length === 0) {
    return <LoadingState />;
  }

  // No search results
  if (filteredProducts.length === 0) {
    // Get unique brands, categories, genders
    const brands = [...new Set(products?.map((p) => p.brandName).filter(Boolean))];
    const categories = [...new Set(products?.map((p) => p.categoryName).filter(Boolean))];
    const genders = [...new Set(products?.map((p) => p.gender).filter(Boolean))];

    return (
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          onClear={() => setSearchQuery("")}
        />
        <FilterBar
          onFilterChange={setFilters}
          brands={brands}
          categories={categories}
          genders={genders}
          currentFilters={filters}
          onSortChange={setSortBy}
          currentSort={sortBy}
        />
        <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="🔍"
              message="No products found"
              subMessage="Try searching for something else"
            />
          }
        />
      </View>
    );
  }

  // Get unique brands, categories, genders
  const brands = [...new Set(products?.map((p) => p.brandName).filter(Boolean))];
  const categories = [...new Set(products?.map((p) => p.categoryName).filter(Boolean))];
  const genders = [...new Set(products?.map((p) => p.gender).filter(Boolean))];

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products..."
        onClear={() => setSearchQuery("")}
      />
      <FilterBar
        onFilterChange={setFilters}
        brands={brands}
        categories={categories}
        genders={genders}
        currentFilters={filters}
        onSortChange={setSortBy}
        currentSort={sortBy}
      />
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigateToDetail(item)}
            onFavoritePress={() => handleFavoriteToggle(item)}
            isFavorite={isFavorite(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  headerContainer: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#757575",
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
  loadMoreContainer: {
    backgroundColor: "#fff3e0",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 14,
    color: "#e65100",
    fontWeight: "600",
  },
  loadMoreSubText: {
    fontSize: 12,
    color: "#f57c00",
    marginTop: 4,
  },
});

export default Home;
