import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiImage } from "react-icons/fi";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getBlogs } from "../../services/blogs";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
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

  const skinTypes = [
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
  const [errors, setErrors] = useState({});
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    action: "",
    summary: "",
    category: "",
    skinType: "",
    imgURL: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await getBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  const validateForm = () => {
    const newErrors = {};
    if (!newBlog.title || newBlog.title.length < 5 || newBlog.title.length > 100) {
      newErrors.title = "Title must be between 5 and 100 characters";
    }
    if (!newBlog.content || newBlog.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }
    if (!newBlog.summary || newBlog.summary.length < 50 || newBlog.summary.length > 250) {
      newErrors.summary = "Summary must be between 50 and 250 characters";
    }
    if (!newBlog.category) {
      newErrors.category = "Please select a category";
    }
    if (!newBlog.skinType) {
      newErrors.skinType = "Please select a skin type";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!newBlog.title.trim() || !newBlog.content.trim()) {
        Swal.fire("Error", "Enter full information!", "error");
        return;
      }

      const requestBody = {
        title: newBlog.title.trim(),
        content: newBlog.content.trim(),
        imageUrl: newBlog.imgURL || "",
        summary: newBlog.summary || "",
        skintype: newBlog.skinType || "All",
        category: newBlog.category || "General",
      };

      const response = await fetch("http://localhost:5286/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.status === 201) {
        await fetchBlogs();
        setNewBlog({ title: "", content: "", skinType: "", category: "", imgURL: "" });
        Swal.fire("Success", "Add blog successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to add blog", "error");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      Swal.fire("Error", "Error adding blog", "error");
    }
  };


  const resetForm = () => {
    setNewBlog({
      title: "",
      content: "",
      action: "",
      summary: "",
      category: "",
      skinType: "",
      imgURL: "",
    });
    setSelectedBlog(null);
    setErrors({});
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setNewBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setBlogs(prev => prev.filter(blog => blog.id !== selectedBlog.id));
    setIsDeleteModalOpen(false);
    setSelectedBlog(null);
  };
  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };


  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.skinType.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Add New Blog
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full rounded-lg border pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg bg-white shadow-md dark:bg-gray-800">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skin Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.content}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.imgURL}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.skinType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{blog.createdAt}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="mr-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`mx-1 px-4 py-2 rounded ${currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"}`}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter blog title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>



                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
                    </label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skin Type *
                    </label>
                    <select
                      value={newBlog.skinType}
                      onChange={(e) => setNewBlog({ ...newBlog, skinType: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select skin type</option>
                      {skinTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.skinType && (
                      <p className="mt-1 text-sm text-red-600">{errors.skinType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="fas fa-image mr-1"></i> Hình ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-40 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400">
                          <i className="fas fa-image text-4xl"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    rows={8}
                    value={newBlog.content}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, content: e.target.value })
                    }
                  />
                </div>


                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {selectedBlog ? "Update Blog" : "Create Blog"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Confirm Delete
              </h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this blog? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;