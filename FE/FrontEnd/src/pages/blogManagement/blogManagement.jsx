import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getBlogs, updateBlog, createBlog, deleteBlog } from "../../services/blogs";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import ConfirmModal from "./ConfirmModal";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const categories = [
    "Cleanser",
    "Moisturizer",
    "Serum",
    "Sunscreen",
    "Toner",
    "Exfoliator",
    "Essence",
    "Face Mask",
    "Eye Cream",
    "Face Oil"
  ];

  const skintypes = [
    "OSPW", "OSPT", "OSNW", "OSNT",
    "ORPW", "ORPT", "ORNW", "ORNT",
    "DSPW", "DSPT", "DSNW", "DSNT",
    "DRPW", "DRPT", "DRNW", "DRNT"
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogs();
      setBlogs(response.reverse());
    } catch (error) {
      console.error("Error fetching blogs:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch blogs. Please try again.",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setSelectedBlog(null);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBlog || !selectedBlog.id) {
      console.error("No blog selected for deletion");
      return;
    }

    try {
      setIsLoading(true);
      await deleteBlog(selectedBlog.id);
      
      setBlogs((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));
      
      Swal.fire({
        title: "Deleted!",
        text: "Blog has been deleted successfully.",
        icon: "success"
      });
      
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete blog. Please try again.",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      let response;

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim(),
        category: formData.category,
        skintype: formData.skintype,
        imageUrl: formData.imageUrl || ""
      };

      if (selectedBlog) {
        response = await updateBlog(selectedBlog.id, blogData);
        
        setBlogs(prev => 
          prev.map(blog => blog.id === selectedBlog.id ? { ...blog, ...response } : blog)
        );
        
        Swal.fire({
          title: "Thành công",
          text: "Cập nhật bài viết thành công!",
          icon: "success"
        });
      } else {
        response = await createBlog(blogData);
        
        setBlogs(prev => [...prev, response]);
        
        Swal.fire({
          title: "Thành công",
          text: "Tạo bài viết mới thành công!",
          icon: "success"
        });
      }

      await fetchBlogs();

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting blog:", error);
      
      Swal.fire({
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return (blogs || []).filter(blog =>
      (blog.title?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) ||
      (blog.category?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim()) ||
      (blog.skintype?.toLowerCase() || "").includes(searchTerm.toLowerCase().trim())
    );
  }, [blogs, searchTerm]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black-400 dark:text-white">Blog Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center rounded-lg bg-rose-400 px-4 py-2 text-white hover:bg-rose-700"
            disabled={isLoading}
          >
            <FiPlus className="mr-2" /> Add New Blog
          </button>
        </div>

        <div className="flex justify-center items-center my-4 gap-1">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full rounded-lg border pl-10 pr-4 py-2 focus:border-rose-500 focus:outline-none dark:bg-rose-800 dark:border-rose-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-2 text-gray-500 text-sm"
                onClick={() => setSearchTerm("")}
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <BlogList 
            blogs={paginatedBlogs} 
            onEdit={handleEdit} 
            onDelete={(blog) => {
              setSelectedBlog(blog);
              setIsDeleteModalOpen(true);
            }}
            searchTerm={searchTerm}
          />
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`mx-1 px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-rose-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="sticky top-0 mb-6 flex items-center justify-between bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedBlog ? "Edit Blog" : "Create New Blog"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <BlogForm
                blog={selectedBlog}
                categories={categories}
                skintypes={skintypes}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              />
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <ConfirmModal
            title="Confirm Delete"
            message="Are you sure you want to delete this blog? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            isDestructive={true}
          />
        )}
      </div>
    </div>
  );
};

export default BlogManagement;