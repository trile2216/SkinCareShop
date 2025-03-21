import { toast } from "react-toastify";
import api from "../config/axios";

export const getBlogs = async () => {
    try {
        const response = await api.get("http://localhost:5286/api/blog/all");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};

export const getAllBlogCategories = async () => {
    try {
        const response = await api.get("http://localhost:5286/api/blog/categories");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};

export const getAllBlogSkintypes = async () => {
    try {
        const response = await api.get("http://localhost:5286/api/blog/skintypes");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};


// export const getBlogById = async (id) => {
//     try {
//         const response = await api.get(`/blog/${id}`);
//         return response.data;
//     } catch (error) {
//         toast.error(error.response?.data || "Error fetching blog details");
//     }
// };

// export const createBlog = async (blogData) => {
//     try {
//         const response = await api.post("/blog/create", blogData);
//         return response.data;
//     } catch (error) {
//         toast.error(error.response?.data || "Error creating blog");
//     }
// };

// export const updateBlog = async ({ id, blogData }) => {
//     try {
//         const response = await api.put(`/blog/update/${id}`, blogData);
//         return response.data;
//     } catch (error) {
//         toast.error(error.response?.data || "Error updating blog");
//     }
// };

// export const deleteBlog = async (id) => {
//     try {
//         await api.delete(`/blog/delete/${id}`);
//         toast.success("Blog deleted successfully");
//     } catch (error) {
//         toast.error(error.response?.data || "Error deleting blog");
//     }
// };
