import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import useScrollToTop from "../hooks/useScrollToTop";

const MainLayout = ({ children }) => {
    useScrollToTop();

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default MainLayout; 