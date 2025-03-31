import React from "react";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";

const BlogList = ({ blogs, onEdit, onDelete, searchTerm }) => {
  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="font-bold text-rose-500">{part}</span>
      ) : (
        part
      )
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (blogs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <FiImage className="text-gray-400 text-5xl mb-2" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {searchTerm 
              ? "Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm." 
              : "Chưa có bài viết nào. Hãy thêm bài viết mới để bắt đầu."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-md dark:bg-gray-800">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tittle</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Summary</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Pcture</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
            <th className="px-6 py-3 text-left text-xs w-40 font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skin type</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created day</th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog) => (
            <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {searchTerm ? highlightText(blog.title, searchTerm) : blog.title}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {blog.summary ? 
                  (searchTerm 
                    ? highlightText(truncateText(blog.summary, 60), searchTerm) 
                    : truncateText(blog.summary, 60)
                  ) : (
                    <span className="text-gray-400 italic">Không có tóm tắt</span>
                  )
                }
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {blog.imageUrl ? (
                  <div className="relative group">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="h-12 w-20 rounded-md object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a 
                        href={blog.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white text-xs px-2 py-1 bg-black bg-opacity-70 rounded"
                      >
                        Xem
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <FiImage className="text-gray-400" />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs dark:bg-blue-900 dark:text-blue-200">
                  {searchTerm ? highlightText(blog.category, searchTerm) : blog.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs dark:bg-green-900 dark:text-green-200">
                  {searchTerm ? highlightText(blog.skintype, searchTerm) : blog.skintype}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {blog.createdAt ? (
                  <span className="whitespace-nowrap">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                ) : "N/A"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => onEdit(blog)}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                    title="Sửa bài viết"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(blog)}
                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                    title="Xóa bài viết"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogList;