import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Detail from "../screens/Detail";
import Favorites from "../screens/Favorites";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import Cart from "../screens/Cart";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import useCart from "../hooks/useCart";
import useAuth from "../context/useAuth";
import Quiz from "../screens/Quiz";
import QuizResult from "../screens/QuizResult";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { instance } from "../lib/axios";
import { createStackNavigator as createInnerStack } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const CartTabIcon = ({ focused, color, size }) => {
  const { totalItems } = useCart();
  
  return (
    <View style={styles.cartIconContainer}>
      <Ionicons
        name={focused ? "cart" : "cart-outline"}
        size={size}
        color={color}
      />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

const BottomTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Quiz") {
            iconName = focused ? "document-text" : "document-text-outline";
          }else if (route.name === "Cart") {
            return <CartTabIcon focused={focused} color={color} size={size} />;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="Favorites"
        component={Favorites}
        options={{ tabBarLabel: "Favorites", headerShown: false }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: "Profile", headerShown: false }}
      />
      <Tabs.Screen
        name="Cart"
        component={Cart}
        options={{ tabBarLabel: "Cart", headerShown: false   }}
      />
      <Tabs.Screen
        name="Quiz"
        // The Quiz tab is a small inner stack that decides whether to show
        // the quiz flow or the user's quiz result. See `QuizStack` below.
        component={QuizStack}
        options={{ tabBarLabel: "Quiz", headerShown: false }}
      />
    </Tabs.Navigator>
  );
};

// Inner stack used for the Quiz tab. Decides initial screen based on whether
// the user already has a quiz result. This component renders a Stack
// navigator after it determines which screen should be initial.
function QuizStack() {
  const StackQuiz = createInnerStack();
  const [initialRoute, setInitialRoute] = useState(null);
  const  customerId = useSelector((state) => state.user?.customerId);

  useEffect(() => {
    let mounted = true;
    const decide = async () => {
      try {
        if (!customerId) {
          if (mounted) setInitialRoute("Quiz");
          return;
        }
        try {
          const res = await instance.get(`/quiz/result/${customerId}`);
          if (res?.data) {
            if (mounted) setInitialRoute("QuizResult");
          } else {
            if (mounted) setInitialRoute("Quiz");
          }
        } catch (err) {
          // If 404 or other error meaning no result, fall back to Quiz
          if (err?.response?.status === 404) {
            if (mounted) setInitialRoute("Quiz");
          } else {
            // For other network errors, still allow user to go to Quiz
            if (mounted) setInitialRoute("Quiz");
          }
        }
      } catch (err) {
        console.warn("QuizStack decide error:", err);
        if (mounted) setInitialRoute("Quiz");
      }
    };

    decide();
    return () => (mounted = false);
  }, []);

  if (!initialRoute) {
    // Still deciding
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#6b21a8" />
      </View>
    );
  }

  return (
    <StackQuiz.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <StackQuiz.Screen name="Quiz" component={Quiz} />
      <StackQuiz.Screen name="QuizResult" component={QuizResult} />
    </StackQuiz.Navigator>
  );
}

const RootNavigation = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isLoggedIn ? (
          // Auth Stack
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Register"
              component={Register}
            />
          </Stack.Group>
        ) : (
          // App Stack
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen
              name="Tabs"
              component={BottomTabs}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Detail" component={Detail} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  cartIconContainer: {
    width: 30,
    height: 30,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: "#ff5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default RootNavigation;
