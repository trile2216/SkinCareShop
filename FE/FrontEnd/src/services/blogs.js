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
export const createBlog = async (formData) => {
    try {
        const response = await api.post("http://localhost:5286/api/blog/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        toast.error(error.response?.data || "Error creating blog");
        throw error;
    }
};

export const blogService = {
    getBlogById: async (blogId) => {
        try {
            const response = await api.get(`/blog/${blogId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching blog by ID:", error);
            throw error;
        }
    },
};





// export const getBlogById = async (id) => {
//     try {
//         const response = await api.get(`/blog/${id}`);
//         return response.data;
//     } catch (error) {
//         toast.error(error.response?.data || "Error fetching blog details");
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
