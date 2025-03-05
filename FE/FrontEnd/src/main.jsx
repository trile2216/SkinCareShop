import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import LoginPage from "./pages/login/index.jsx";
import RegisterPage from "./pages/register/index.jsx";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/homepage/HomePage.jsx";
import SkinQuiz from "./pages/quiz/Quiz.jsx";
import ProductList from "./pages/productlist/productList.jsx";
import Checkout from "./pages/checkout/CheckOut.jsx";
import ProductManagement from "./pages/productManament/ProductManagement.jsx";
import ProductDetail from "./pages/productDetail/productDetail.jsx";
import CheckOutDetail from "./pages/checkout/CheckOutDetails.jsx";
import { Provider } from "react-redux";
import { store } from "./context/store.jsx";
import CustomerProfile from "./pages/customerProfile/index.jsx";
<<<<<<< Updated upstream

import { CartProvider } from "./context/CartContext"; 
=======
import { CartProvider } from "./context/CartContext.jsx";
>>>>>>> Stashed changes
// document.getElementById('root')
// 1. Tìm tới root
// 2. Lấy code ở trong App gắn vào root

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/skinquiz",
    element: <SkinQuiz />,
  },
  {
    path: "/productlist",
    element: <ProductList />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/productmanagement",
    element: <ProductManagement />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/checkoutDetail",
    element: <CheckOutDetail />,
  },

  {
    path: "/customerProfile",
    element: <CustomerProfile />,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
<<<<<<< Updated upstream
     <Provider store={store}>
        <CartProvider>
            <RouterProvider router={router} />
            <ToastContainer />
        </CartProvider>
      </Provider>
=======
    <Provider store={store}>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CartProvider>
    </Provider>
>>>>>>> Stashed changes
  </>
);

// Single Page Application
// client side rendering
// SEO
