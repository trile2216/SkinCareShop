import { toast } from "react-toastify";
import api from "../config/axios";

export const getBlogs = async () => {
    try {
        const response = await api.get("blog/all");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};


export const getAllBlogCategories = async () => {
    try {
        const response = await api.get("blog/categories");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};
export const getAllBlogSkintypes = async () => {
    try {
        const response = await api.get("blog/skintypes");
        return response.data;
    } catch (error) {
        toast.error(error);
    }
};
export const createBlog = async (formData) => {
    try {
        const response = await api.post("blog/create", formData, {
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

export const deleteBlog = async (id) => {
    try {
        console.log("Deleting blog with ID:", id);
        await api.delete(`/blog/delete/${id}`);
    } catch (error) {
        console.error("Error deleting blog:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Error deleting blog");
        throw error;
    }
};

export const searchBlogs = async (query) => {
    try {
        const response = await api.get(`/blog/search?query=${query}`);
        return response.data;
    } catch (error) {
        toast.error("Error searching blogs");
        throw error;
    }
};

export const updateBlog = async (id, blogData) => {
    try {
        // Gửi request PUT đến API
        const response = await api.put(`/blog/update/${id}`, blogData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Thông báo thành công
        toast.success("Blog updated successfully");
        return response.data;
    } catch (error) {
        // Xử lý lỗi và thông báo rõ ràng cho người dùng
        const errorMessage =
            error.response?.data?.message || "Error updating blog";
        console.error("Error updating blog:", errorMessage);
        toast.error(errorMessage);
        throw error; // Ném lỗi để bên gọi hàm xử lý thêm nếu cần
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
