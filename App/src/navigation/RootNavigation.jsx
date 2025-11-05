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
import { View, Text, StyleSheet } from "react-native";
import useCart from "../hooks/useCart";
import useAuth from "../context/useAuth";

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
          } else if (route.name === "Cart") {
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
        options={{ tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="Favorites"
        component={Favorites}
        options={{ tabBarLabel: "Favorites" }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: "Profile" }}
      />
      <Tabs.Screen
        name="Cart"
        component={Cart}
        options={{ tabBarLabel: "Cart" }}
      />
    </Tabs.Navigator>
  );
};

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
