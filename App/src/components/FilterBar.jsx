import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterBar = ({
  onFilterChange,
  brands = [],
  categories = [],
  genders = [],
  currentFilters = {},
  onSortChange,
  currentSort = "name-asc",
}) => {
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const sortOptions = [
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
    { label: "Sale (Most Discount)", value: "sale-desc" },
  ];

  const handleBrandSelect = (brand) => {
    const newBrands = currentFilters.brands?.includes(brand)
      ? currentFilters.brands.filter((b) => b !== brand)
      : [...(currentFilters.brands || []), brand];
    onFilterChange({ ...currentFilters, brands: newBrands });
  };

  const handleCategorySelect = (category) => {
    const newCategories = currentFilters.categories?.includes(category)
      ? currentFilters.categories.filter((c) => c !== category)
      : [...(currentFilters.categories || []), category];
    onFilterChange({ ...currentFilters, categories: newCategories });
  };

  const handleGenderSelect = (gender) => {
    const newGenders = currentFilters.genders?.includes(gender)
      ? currentFilters.genders.filter((g) => g !== gender)
      : [...(currentFilters.genders || []), gender];
    onFilterChange({ ...currentFilters, genders: newGenders });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (currentFilters.brands?.length > 0) ||
    (currentFilters.categories?.length > 0) ||
    (currentFilters.genders?.length > 0);

  const FilterButton = ({ label, icon, onPress, badge }) => (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <Ionicons name={icon} size={16} color="#667eea" />
      <Text style={styles.filterButtonText}>{label}</Text>
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const FilterModal = ({ visible, title, items, onSelect, selectedItems }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (title === "Brand") setShowBrandFilter(false);
        else if (title === "Category") setShowCategoryFilter(false);
        else if (title === "Gender") setShowGenderFilter(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              onPress={() => {
                if (title === "Brand") setShowBrandFilter(false);
                else if (title === "Category") setShowCategoryFilter(false);
                else if (title === "Gender") setShowGenderFilter(false);
              }}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => onSelect(item)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedItems?.includes(item) && styles.checkboxChecked,
                  ]}
                >
                  {selectedItems?.includes(item) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.filterItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const SortModal = ({ visible }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortFilter(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortFilter(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={sortOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => {
                  onSortChange(item.value);
                  setShowSortFilter(false);
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    currentSort === item.value && styles.checkboxChecked,
                  ]}
                >
                  {currentSort === item.value && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.filterItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <FilterButton
          label="Brand"
          icon="pricetag"
          onPress={() => setShowBrandFilter(true)}
          badge={currentFilters.brands?.length || 0}
        />
        <FilterButton
          label="Category"
          icon="list"
          onPress={() => setShowCategoryFilter(true)}
          badge={currentFilters.categories?.length || 0}
        />
        <FilterButton
          label="Gender"
          icon="person"
          onPress={() => setShowGenderFilter(true)}
          badge={currentFilters.genders?.length || 0}
        />
        <FilterButton
          label="Sort"
          icon="swap-vertical"
          onPress={() => setShowSortFilter(true)}
          badge={0}
        />
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllFilters}
          >
            <Ionicons name="close-circle" size={16} color="#d32f2f" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <FilterModal
        visible={showBrandFilter}
        title="Brand"
        items={brands}
        onSelect={handleBrandSelect}
        selectedItems={currentFilters.brands}
      />
      <FilterModal
        visible={showCategoryFilter}
        title="Category"
        items={categories}
        onSelect={handleCategorySelect}
        selectedItems={currentFilters.categories}
      />
      <FilterModal
        visible={showGenderFilter}
        title="Gender"
        items={genders}
        onSelect={handleGenderSelect}
        selectedItems={currentFilters.genders}
      />
      <SortModal visible={showSortFilter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 4,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  badge: {
    backgroundColor: "#667eea",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d32f2f",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  filterItemText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
});

export default FilterBar;
