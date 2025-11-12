import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from "../provider/StorageProvider";
import ProductCard from "../components/ProductCard";
import { EmptyState } from "../components/StateComponents";

const Favorites = () => {
  const navigation = useNavigation();
  const {
    removeStorageData: removeFromFavorites,
    storageData: favorites,
  } = useStorageContext();

  const navigateToDetail = (product) => {
    navigation.navigate("Detail", { product });
  };

  const isFavorite = (itemId) => favorites?.some((fav) => fav.id === itemId);

  const handleFavoriteToggle = (item) => {
    removeFromFavorites(item.id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <EmptyState
            icon="♡"
            message="No favorites yet"
            subMessage="Items you add to favorites will appear here"
          />
        }
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
    paddingTop: 40,
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
});

export default Favorites;
