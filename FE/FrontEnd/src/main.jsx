import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
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
import Result from "./pages/quiz/Result.jsx";
import CheckoutResult from "./pages/paymentResult/CheckoutResult.jsx";
import ChangePassword from "./pages/login/ChangePassword.jsx";
import OrderHistory from "./pages/orderHistory/orderHistory.jsx";
import UserManagement from "./pages/userManagement/UserManagement.jsx";
import CustomerProfile from "./pages/customerProfile/CustomerProfile.jsx";
import Overview from "./pages/overview/overview.jsx";
// document.getElementById('root')
// 1. Tìm tới root
// 2. Lấy code ở trong App gắn vào root

// Wrapper component để áp dụng MainLayout
const CustomerLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const router = createBrowserRouter([
  // Các trang không cần layout
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/changePassword",
    element: <ChangePassword />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Các trang customer sử dụng MainLayout
  {
    element: <CustomerLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/skinquiz",
        element: <SkinQuiz />,
      },
      {
        path: "/result",
        element: <Result />,
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
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/checkout-details",
        element: <CheckOutDetail />,
      },
      {
        path: "/payment-result",
        element: <CheckoutResult />,
      },
      {
        path: "/customerProfile",
        element: <CustomerProfile />,
      },
      {
        path: "/sale",
        element: <Sale />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/order-history",
        element: <OrderHistory />,
      },
    ],
  },

  // Admin layout vẫn giữ nguyên
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "overview", element: <Overview /> },
      { path: "product", element: <ManageProduct /> },
      { path: "order", element: <OrderManagement /> },
      { path: "quiz", element: <QuizManagement /> },
      { path: "user", element: <UserManagement /> },
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
