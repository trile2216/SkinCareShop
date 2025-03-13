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
import ProductDetail from "./pages/productDetail/productDetail.jsx";
import CheckOutDetail from "./pages/checkout/CheckOutDetails.jsx";
import { Provider } from "react-redux";
import { store } from "./context/store.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Sale from "./pages/sale/sale.jsx";
import AdminLayout from "./layouts/adminLayout.jsx";
import ManageProduct from "./pages/productManament/manage-product.jsx";
import OrderManagement from "./pages/orderManagement/index.jsx";
import ProtectedRoute from "../src/context/ProtectedRoute.jsx";
import Blog from "./pages/blog/Blog.jsx";
import QuizManagement from "./pages/quizManagement/QuizManagement.jsx";
import CustomerProfile from "./pages/customerProfile/CustomerProfile.jsx";
import OrderHistory from "./pages/orderHistory/orderHistory.jsx";
// document.getElementById('root')
// 1. Tìm tới root
// 2. Lấy code ở trong App gắn vào root

const router = createBrowserRouter([
  // All
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
    path: "/sale",
    element: <Sale />,
  },
  {
    path: "/productlist",
    element: <ProductList />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },

  //Customer
  {
    path: "/skinquiz",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <SkinQuiz />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkoutDetail",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <CheckOutDetail />
      </ProtectedRoute>
    ),
  },

  {
    path: "/customerProfile",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <CustomerProfile />
      </ProtectedRoute>
    ),
  },




  //Admin
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "product", element: <ManageProduct /> },
      { path: "order", element: <OrderManagement /> },
      { path: "quizManagement", element: <QuizManagement /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CartProvider>
    </Provider>
  </>
);

// Single Page Application
// client side rendering
// SEO
