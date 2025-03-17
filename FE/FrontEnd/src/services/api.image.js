import { toast } from "react-toastify";
import api from "../config/axios";

export const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("file", image);
        const response = await api.post("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        toast.error(error.response?.data || "Failed to upload image");
        throw error;
    }
}