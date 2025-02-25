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
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/checkout/CheckOut.jsx";
import ProductManagement from "./pages/productManament/ProductManagement.jsx";
import CheckOutDetail from "./pages/checkout/CheckOutDetails.jsx";

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
    path: "/homepage",
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
    path: "/checkoutDetail",
    element: <CheckOutDetail />,
  },
 
]);

createRoot(document.getElementById("root")).render(
  <>
    <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </CartProvider>
  </>
);

// Single Page Application
// client side rendering
// SEO
