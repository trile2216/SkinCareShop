import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { instance } from "../lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

// Mobile Quiz screen adapted from FE Quiz.jsx
export default function Quiz() {
  const navigation = useNavigation();
  const route = useRoute();
  const reduxCustomerId = useSelector((state) => state.user?.customerId);
  const [step, setStep] = useState(0);
  const [mainQuiz, setMainQuiz] = useState(null);
  const [currentSkinQuizIndex, setCurrentSkinQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  // ScrollView ref so we can scroll to top when user advances pages
  const scrollRef = useRef(null);

  // Scroll to top each time the skin quiz index changes or when quiz starts
  useEffect(() => {
    if (scrollRef.current && (step > 0 || currentSkinQuizIndex >= 0)) {
      try {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      } catch (e) {
        // Some platforms may require different call; ignore non-fatal errors
        // console.warn('scrollTo failed', e);
      }
    }
  }, [currentSkinQuizIndex, step]);

  const fetchActiveQuiz = async () => {
    try {
      setLoading(true);
      // Use axios instance (baseURL configured in App/src/lib/axios.js)
      const res = await instance.get("/quiz/active");
      const data = res.data;
      // Handle either object with skinQuizzes or array
      if (data && data.skinQuizzes) {
        setMainQuiz(data);
      } else if (Array.isArray(data) && data.length > 0) {
        setMainQuiz(data[0]);
      } else {
        Alert.alert("No quiz", "No active quiz available.");
      }
    } catch (err) {
      console.error("fetchActiveQuiz error:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to fetch quiz questions";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerId) => {
    const currentSkinQuiz = mainQuiz.skinQuizzes[currentSkinQuizIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentSkinQuiz.id]: {
        ...prev[currentSkinQuiz.id],
        [questionId]: answerId,
      },
    }));
  };

  const getCurrentQuestions = () => {
    if (!mainQuiz || !mainQuiz.skinQuizzes[currentSkinQuizIndex]) return [];
    return mainQuiz.skinQuizzes[currentSkinQuizIndex].questions || [];
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      const customerAnswers = Object.entries(answers).map(
        ([skinQuizId, questionAnswers]) => ({
          skinQuizId: parseInt(skinQuizId, 10),
          skinElement: mainQuiz.skinQuizzes.find(
            (sq) => sq.id === parseInt(skinQuizId, 10)
          )?.skinElement,
          answers: Object.entries(questionAnswers).map(([questionId, answerId]) => ({
            questionId: parseInt(questionId, 10),
            answerId: parseInt(answerId, 10),
          })),
        })
      );

  // Prefer customerId from Redux store (UserSlice), then route params, then AsyncStorage
  let customerId = reduxCustomerId ?? route.params?.customerId ?? null;
      if (!customerId) {
        try {
          const stored = await AsyncStorage.getItem("customerId");
          if (stored) customerId = stored;
        } catch (e) {
          console.warn("AsyncStorage read failed for customerId", e);
        }
      }

      // Ensure customerId is an integer when sending to backend
      const parsedCustomerId = customerId ? parseInt(customerId, 10) : null;

      // Some backend DTOs expect 'customerAnswers' (or PascalCase 'CustomerAnswers').
      // Send both keys to be compatible while we verify the correct shape.
      const submission = {
        mainQuizId: mainQuiz?.id,
        customerId: parsedCustomerId,
        customerAnswers: customerAnswers,
      };

      // Log submission payload to help debug 400 errors
      console.log("Submitting quiz payload:", JSON.stringify(submission, null, 2));

      // Assumption: submission endpoint
      const res = await instance.post("/quiz/submit", submission);
      const result = res.data;
  // Navigate to QuizResult screen in the Quiz stack.
  navigation.navigate("QuizResult", { resultId: result?.id });
    } catch (err) {
      // Log axios error details to help diagnose 400 Bad Request
      console.error("submitQuiz error:", err);
      if (err?.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      const msg = err?.response?.data?.message || JSON.stringify(err?.response?.data) || err.message || "Failed to submit quiz";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!mainQuiz) return;
    if (currentSkinQuizIndex < mainQuiz.skinQuizzes.length - 1) {
      setCurrentSkinQuizIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const renderWelcome = () => (
    <View style={styles.centerBox}>
      <Text style={styles.title}>Discover Your Skin Type</Text>
      <TouchableOpacity
        onPress={() => setStep(1)}
        style={styles.startButton}
        accessibilityRole="button"
      >
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    if (loading || !mainQuiz) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#6b21a8" />
        </View>
      );
    }

    const currentSkinQuiz = mainQuiz.skinQuizzes[currentSkinQuizIndex];
    const currentQuestions = getCurrentQuestions();

    const progressPercent = Math.round(
      ((currentSkinQuizIndex + 1) / (mainQuiz?.skinQuizzes?.length || 1)) * 100
    );

    return (
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <View style={styles.progressWrap}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{`${currentSkinQuizIndex + 1}/${mainQuiz?.skinQuizzes?.length}`}</Text>
        </View>

        {currentQuestions.map((question, qIndex) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{qIndex + 1}</Text>
              </View>
              <Text style={styles.questionText}>{question.content}</Text>
            </View>

            <View style={styles.answersList}>
              {question.answers.map((answer) => {
                const selected = answers[currentSkinQuiz.id]?.[question.id] === answer.id;
                return (
                  <TouchableOpacity
                    key={answer.id}
                    style={[
                      styles.answerItem,
                      selected ? styles.answerSelected : styles.answerDefault,
                    ]}
                    onPress={() => handleAnswer(question.id, answer.id)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.answerText}>{answer.content}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setCurrentSkinQuizIndex((prev) => Math.max(0, prev - 1))}
            style={[styles.controlButton, currentSkinQuizIndex === 0 && styles.disabledButton]}
            disabled={currentSkinQuizIndex === 0}
          >
            <Text style={styles.controlText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.controlButtonPrimary, !answers[currentSkinQuiz.id] && styles.disabledButton]}
            disabled={!answers[currentSkinQuiz.id]}
          >
            <Text style={styles.controlTextPrimary}>
              {currentSkinQuizIndex === mainQuiz?.skinQuizzes?.length - 1 ? "See Results" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return <View style={styles.page}>{step === 0 ? renderWelcome() : renderQuestion()}</View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 40 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#212121", marginBottom: 20, textAlign: "center" },
  startButton: {
    backgroundColor: "#6b21a8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  startButtonText: { color: "white", fontWeight: "600" },
  container: { padding: 16, paddingBottom: 36 },
  progressWrap: { marginBottom: 12 },
  progressBarBackground: { height: 8, backgroundColor: "#E6E6FA", borderRadius: 8, overflow: "hidden" },
  progressBarFill: { height: 8, backgroundColor: "#6b21a8" },
  progressText: { textAlign: "right", color: "#212121", marginTop: 6 },
  questionCard: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12, elevation: 1 },
  questionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  indexCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#6b21a8", alignItems: "center", justifyContent: "center", marginRight: 10 },
  indexText: { color: "white", fontWeight: "700" },
  questionText: { fontSize: 16, fontWeight: "600", color: "#3f3d56", flex: 1 },
  answersList: { marginTop: 6 },
  answerItem: { padding: 12, borderRadius: 8, marginBottom: 8 },
  answerSelected: { borderWidth: 2, borderColor: "#6b21a8", backgroundColor: "#FFFFFF" },
  answerDefault: { borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" },
  answerText: { color: "#374151" },
  controls: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  controlButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: "transparent" },
  controlButtonPrimary: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: "#6b21a8" },
  disabledButton: { opacity: 0.5 },
  controlText: { color: "#212121", fontWeight: "600" },
  controlTextPrimary: { color: "white", fontWeight: "600" },
});