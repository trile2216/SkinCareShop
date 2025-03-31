import React, { useState, useEffect } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { uploadFileCloudinary } from "../../utils/upload";

const BlogForm = ({ blog, categories, skintypes, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "",
    skintype: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        summary: blog.summary || "",
        category: blog.category || "",
        skintype: blog.skintype || "",
        imageUrl: blog.imageUrl || "",
      });

      if (blog.imageUrl) {
        setPreviewImage(blog.imageUrl);
      }
    }
  }, [blog]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5 || formData.title.length > 100) {
      newErrors.title = "Title must be between 5 and 100 characters";
    }
    if (!formData.content || formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }
    if (!formData.summary || formData.summary.length < 50 || formData.summary.length > 250) {
      newErrors.summary = "Summary must be between 50 and 250 characters";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.skintype) {
      newErrors.skintype = "Please select a skin type";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        setIsUploading(true);
        imageUrl = await uploadFileCloudinary(selectedFile);
      }

      const finalData = {
        ...formData,
        imageUrl: imageUrl
      };

      onSubmit(finalData);

    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({
        ...prev,
        imageUrl: "Không thể tải ảnh lên. Vui lòng thử lại."
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">

      <div className="grid gap-4 grid-cols-2">


        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter blog title"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formData.title.trim().split(/\s+/).filter(Boolean).length} words
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
            name="skintype"
            value={formData.skintype}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select skin type</option>
            {skintypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.skintype && (
            <p className="mt-1 text-sm text-red-600">{errors.skintype}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiImage className="inline mr-2" /> Image

          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
          )}

          <div className="mt-3 border rounded-lg p-2 bg-gray-50">
            {isUploading ? (
              <div className="h-40 flex items-center justify-center text-gray-400">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : previewImage ? (
              <img
                src={previewImage}
                alt="Xem trước"
                className="h-40 object-cover rounded-lg mx-auto"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">
                <FiImage className="text-4xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          name="content"
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-3"
          rows={8}
          value={formData.content}
          onChange={handleChange}
          placeholder="Enter blog content"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formData.content.trim().split(/\s+/).filter(Boolean).length} words
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Summary *
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Enter blog summary"
          rows={1}
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formData.summary.trim().split(/\s+/).filter(Boolean).length} words
        </div>
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-rose-400 px-6 py-2.5 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          {blog ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;