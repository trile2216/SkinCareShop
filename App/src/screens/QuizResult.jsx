import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	Image,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { instance } from "../lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import RecomenedCard from "../components/RecomenedCard";

export default function QuizResult() {
	const route = useRoute();
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState(null);
	const [routines, setRoutines] = useState([]);
	const [recommendedProducts, setRecommendedProducts] = useState({});

	useEffect(() => {
		fetchResult();
	}, []);

	// try get customerId from redux store first
	const reduxCustomerId = useSelector((state) => state.user?.customerId);

	const fetchResult = async () => {
		try {
			setLoading(true);

			const resultId = route.params?.resultId ?? null;
			let detailedResult = null;

			if (resultId) {
				// Try to fetch by result id
				const res = await instance.get(`/quiz/result/${resultId}`);
				detailedResult = res.data;
			} else {
				// Fallback: try customerId from redux, route params or AsyncStorage
				let customerId = reduxCustomerId ?? route.params?.customerId ?? null;
				if (!customerId) {
					try {
						const stored = await AsyncStorage.getItem("customerId");
						if (stored) customerId = stored;
					} catch (e) {
						console.warn("AsyncStorage read failed for customerId", e);
					}
				}
				if (!customerId) {
					Alert.alert("No identifier", "No resultId or customerId available to fetch quiz result.");
					setLoading(false);
					return;
				}
				const res = await instance.get(`/quiz/result/${customerId}`);
				detailedResult = res.data;
			}

			setResult(detailedResult);

			// Fetch routines for skinTypeId
			const skinTypeId = detailedResult?.skinTypeId;
			if (skinTypeId) {
				// Use FE endpoints: /routine/skintype/{id}
				const r = await instance.get(`/routine/skintype/${skinTypeId}`);
				const routinesData = r.data || [];
				setRoutines(routinesData);

				// For each routine step, fetch recommended products
				const productsMap = {};
					for (const routine of routinesData) {
						for (const step of routine.steps || []) {
							try {
								// FE product endpoint: /product/recommendation/{skinTypeId}&{categoryId}
								const p = await instance.get(
									`/product/recommendation/${skinTypeId}&${step.categoryId}`
								);
								const products = p.data || [];
								// Debug: log full product structure so we can inspect productSkinTypes shape
								try {
									console.log('products raw:', JSON.stringify(products, null, 2));
								} catch (e) {
									console.log('products (non-serializable):', products);
								}

								// Helper: normalize productSkinTypes entries into {skinTypeId, level}
								const extractEntries = (product) => {
									const list = product.productSkinTypes || product.productSkinType || product.product_skin_types || [];
									if (!Array.isArray(list)) return [];
									const out = [];
									for (const pst of list) {
										if (!pst) continue;
										// try common shapes and always coerce level to a number when possible
										const maybeId = pst.skinTypeId ?? (pst.skinType && pst.skinType.id) ?? pst.skin_type_id ?? pst.id ?? pst[Object.keys(pst)[0]];
										const rawLevel = pst.recommentedLevel ?? pst.recommendedLevel ?? pst.recommentedlevel ?? pst.recommendedlevel ?? pst.level ?? pst[Object.keys(pst)[1]];
										const maybeLevel = rawLevel !== undefined && rawLevel !== null && rawLevel !== '' ? Number(rawLevel) : undefined;
										if (maybeId !== undefined) out.push({ skinTypeId: maybeId, level: maybeLevel });
									}
									return out;
								};

								const highlyRecommended = products.filter((product) => {
									const entries = extractEntries(product);
									if (entries.length === 0) {
										console.log(`no productSkinTypes parsed for product ${product.id}`);
									} else {
										console.log(`parsed entries for product ${product.id}:`, JSON.stringify(entries));
									}
									// treat recommendation level >= 3 as recommended (coerce to number)
									return entries.some((e) => e.skinTypeId == skinTypeId && typeof e.level === 'number' && e.level >= 3);
								});
								productsMap[step.id] = highlyRecommended;
							} catch (err) {
								productsMap[step.id] = [];
							}
						}
						}
				setRecommendedProducts(productsMap);
			}
		} catch (err) {
			console.error("fetchResult error:", err);
			const msg = err?.response?.data?.message || err.message || "Failed to fetch result";
			Alert.alert("Error", msg);
		} finally {
			setLoading(false);
		}
	};
	const navigateToDetail = (product) => {
		navigation.navigate("Detail", { product });
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#6b21a8" />
			</View>
		);
	}

	if (!result) {
		return (
			<View style={styles.center}>
				<Text style={styles.emptyText}>No result available.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.page} contentContainerStyle={{ padding: 16 }}>
			<View style={styles.card}>
				<View style={styles.headerCenter}>
					<Text style={styles.symbol}>{result?.symbol}</Text>
					<Text style={styles.characteristics}>{result?.characteristics}</Text>
					<TouchableOpacity
						style={styles.retakeButton}
						onPress={() => {
							Alert.alert(
								"Retake quiz",
								"This will remove your existing quiz result and allow you to retake the quiz. Continue?",
								[
									{ text: "Cancel", style: "cancel" },
									{
										text: "Retake",
										onPress: async () => {
											try {
												// Try best-effort delete of server-side result. Endpoint may vary; ignore failures.
												if (result?.id) {
													await instance.delete(`/quiz/result/${result.id}`);
												} else {
													const cid = reduxCustomerId ?? route.params?.customerId ?? (await AsyncStorage.getItem("customerId"));
													if (cid) await instance.delete(`/quiz/result/${cid}`);
												}
												Alert.alert("Ready", "You can now retake the quiz.");
											} catch (err) {
												console.warn("Retake deletion error:", err);
												Alert.alert("Notice", "Couldn't remove previous result on server. Proceeding to quiz.");
											} finally {
												navigation.navigate("Quiz");
											}
										},
									},
								]
							);
						}}
					>
						<Text style={styles.retakeButtonText}>Retake Quiz</Text>
					</TouchableOpacity>
				</View>

				{routines.length > 0 && (
					<View style={{ marginTop: 16 }}>
						<Text style={styles.sectionTitle}>Your Personalized Skincare Routine</Text>
						{routines
							.sort((a, b) => (a.time === "Morning" ? -1 : 1))
							.map((routine) => (
								<View key={routine.id} style={styles.routineBlock}>
									<Text style={[styles.routineTitle, routine.time === "Morning" ? styles.morning : styles.night]}>
										{routine.time} Routine
									</Text>
									<Text style={styles.routineDesc}>{routine.description}</Text>

									{(routine.steps || [])
										.sort((a, b) => a.stepOrder - b.stepOrder)
										.map((step) => (
											<View key={step.id} style={styles.stepBlock}>
												<Text style={styles.stepTitle}>Step {step.stepOrder}: {step.name}</Text>
												<Text style={styles.stepDesc}>{step.description}</Text>

												{recommendedProducts[step.id]?.length > 0 ? (
													<View style={{ marginTop: 8 }}>
														<Text style={styles.subTitle}>Recommended Products</Text>
														<FlatList
															data={recommendedProducts[step.id]}
															keyExtractor={(i) => String(i.id)}
															horizontal
															showsHorizontalScrollIndicator={false}
															renderItem={({ item }) => <RecomenedCard item={item} navigateToDetail={navigateToDetail} />}
															ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
														/>
													</View>
												) : (
													<View style={{ marginTop: 8 }}>
														<Text style={{ color: '#6b7280', fontStyle: 'italic' }}>No recommended products for this step.</Text>
													</View>
												)}
											</View>
										))}
								</View>
							))}
					</View>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	page: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 40 },
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	card: { backgroundColor: "white", borderRadius: 10, padding: 16, elevation: 2 },
	headerCenter: { alignItems: "center", marginBottom: 12 },
	symbol: { fontSize: 36, fontWeight: "800", color: "#6b21a8" },
	characteristics: { color: "#6b7280", textAlign: "center", marginTop: 8 },
	sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#212121" },
	routineBlock: { marginBottom: 12, padding: 12, backgroundColor: "#fff", borderRadius: 8 },
	routineTitle: { fontSize: 16, fontWeight: "700" },
	routineDesc: { color: "#6b7280", marginBottom: 8 },
	morning: { color: "#b45309" },
	night: { color: "#4338ca" },
	stepBlock: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 8 },
	stepTitle: { fontWeight: "600", color: "#111827" },
	stepDesc: { color: "#6b7280", marginBottom: 8 },
	subTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8, color: "#212121" },

	emptyText: { color: "#6b7280" },
	retakeButton: {
		marginTop: 12,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#6b21a8",
		alignSelf: "center",
	},
	retakeButtonText: { color: "#6b21a8", fontWeight: "700" },
});
