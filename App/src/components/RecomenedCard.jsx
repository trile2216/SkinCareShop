import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function RecomenedCard({ item, navigateToDetail }) {
  return (
    <TouchableOpacity style={styles.productCard} onPress={() => navigateToDetail(item)}>
        { (item.image || item.imageUrl) ? (
            <Image source={{ uri: item.image || item.imageUrl }} style={styles.productImage} />
        ) : (
            <View style={[styles.productImage, styles.productImagePlaceholder]} />
        )}
        <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price ? `$${item.price}` : ""}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({	
    productCard: { width: 120, backgroundColor: "#fff", padding: 8, borderRadius: 8, elevation: 1 },
	productImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 6 },
	productImagePlaceholder: { backgroundColor: "#e5e7eb" },
	productName: { fontSize: 12, fontWeight: "600" },
	productPrice: { fontSize: 12, color: "#6b7280" }
});