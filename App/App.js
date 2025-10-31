import { StyleSheet } from "react-native";
import RootNavigation from "./src/navigation/RootNavigation";
import AppProvider from "./src/provider/AppProvider";
import StorageProvider from "./src/provider/StorageProvider";
import CartProvider from "./src/provider/CartProvider";
import { Provider } from "react-redux";
import store from "./src/context/store";

export default function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <StorageProvider>
          <CartProvider>
            <RootNavigation />
          </CartProvider>
        </StorageProvider>
      </AppProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
