import { useState, useEffect } from "react";
import blog from "./DataBlog";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Blog = () => {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [selectedSkinType, setSelectedSkinType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Lọc bài viết theo loại da và danh mục
    const filteredBlogs = blog.filter(
        (blog) =>
            (selectedSkinType === "All" || blog.skinType === selectedSkinType) &&
            (selectedCategory === "All" || blog.category === selectedCategory)
    );

    // Tính số trang
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Xử lý hiệu ứng ẩn/hiện modal
    useEffect(() => {
        if (selectedBlog) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [selectedBlog]);

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                <h2 className="text-3xl font-bold text-center text-rose-500 mb-6">
                    New blog
                </h2>


                {/* Bộ lọc */}
                <div className="text-1xl text-center text-black mb-6">
                    <select
                        value={selectedSkinType}
                        onChange={(e) => setSelectedSkinType(e.target.value)}
                        className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Skin Types</option>
                        <option value="OSPW">OSPW</option>
                        <option value="OSPT">OSPT</option>
                        <option value="OSNW">OSNW</option>
                        <option value="OSNT">OSNT</option>
                        <option value="ORPW">ORPW</option>
                        <option value="ORPT">ORPT</option>
                        <option value="ORNW">ORNW</option>
                        <option value="ORNT">ORNT</option>
                        <option value="DSPW">DSPW</option>
                        <option value="DSPT">DSPT</option>
                        <option value="DSNW">DSNW</option>
                        <option value="DSNT">DSNT</option>
                        <option value="DRPW">DRPW</option>
                        <option value="DRPT">DRPT</option>
                        <option value="DRNW">DRNW</option>
                        <option value="DRNT">DRNT</option>
                    </select>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Products</option>
                        <option value="Cleanser">Cleanser</option>
                        <option value="Facial Cleanser">Facial Cleanser</option>
                        <option value="Toner">Toner</option>
                        <option value="Serum">Serum</option>
                        <option value="Moisturizer">Moisturizer</option>
                        <option value="Sunscreen">Sunscreen</option>
                    </select>
                </div>


                {/* Hiển thị danh sách bài viết */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                    {paginatedBlogs.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedBlog(post)}
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <button className="mt-4 text-white bg-rose-500 px-4 py-2 rounded-lg hover:bg-rose-400 transition"
                                    onClick={() => window.open(post.link, '_blank')}
                                >
                                    Read more
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            </div>

            {/* Hiển thị Modal bài viết */}
            {selectedBlog && (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
                        onClick={() => setSelectedBlog(null)}
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
                    <img
                        src={selectedBlog.image}
                        alt={selectedBlog.title}
                        className="w-full h-300px object-cover mb-4 rounded-md"
                    />
                    <p className="text-gray-700 leading-relaxed">
                        {selectedBlog.content}
                    </p>
                </div>
            )}
            <Footer />
        </>
    );
};

export default Blog;
