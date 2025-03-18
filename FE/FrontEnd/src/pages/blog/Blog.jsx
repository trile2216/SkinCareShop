import { useState } from "react";
import Select from "react-select";
import blog from "../blog/DataBlog";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Blog = () => {
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const skinTypeOptions = [
    { value: "All", label: "All Skin Types" },
    { value: "OSPW", label: "OSPW" },
    { value: "OSPT", label: "OSPT" },
    { value: "OSNW", label: "OSNW" },
    { value: "OSNT", label: "OSNT" },
    { value: "ORPW", label: "ORPW" },
    { value: "ORPT", label: "ORPT" },
    { value: "ORNW", label: "ORNW" },
    { value: "ORNT", label: "ORNT" },
    { value: "DSPW", label: "DSPW" },
    { value: "DSPT", label: "DSPT" },
    { value: "DSNW", label: "DSNW" },
    { value: "DSNT", label: "DSNT" },
    { value: "DRPW", label: "DRPW" },
    { value: "DRPT", label: "DRPT" },
    { value: "DRNW", label: "DRNW" },
    { value: "DRNT", label: "DRNT" },
  ];

  const categoryOptions = [
    { value: "All", label: "All Products" },
    { value: "Cleanser", label: "Cleanser" },
    { value: "Facial Cleanser", label: "Facial Cleanser" },
    { value: "Toner", label: "Toner" },
    { value: "Serum", label: "Serum" },
    { value: "Moisturizer", label: "Moisturizer" },
    { value: "Sunscreen", label: "Sunscreen" },
  ];

  // Lọc bài viết
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

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        {/* Dropdown bộ lọc */}
        <div className="text-center mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Select
            options={skinTypeOptions}
            defaultValue={skinTypeOptions[0]}
            onChange={(option) => setSelectedSkinType(option.value)}
            className="w-60"
          />
          <Select
            options={categoryOptions}
            defaultValue={categoryOptions[0]}
            onChange={(option) => setSelectedCategory(option.value)}
            className="w-60"
          />
        </div>

        {/* Hiển thị bài viết */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {paginatedBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => window.open(post.link, "_blank")}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button
                  className="mt-4 text-white bg-rose-500 px-4 py-2 rounded-lg hover:bg-rose-400 transition"
                  onClick={() => window.open(post.link, "_blank")}
                >
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-rose-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
