import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen mu-[80px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
