import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadFile = async (file) => {
    const storageRef = ref(storage, file.name);
    const response = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(response.ref);
    return downloadUrl;
};


export const uploadFileCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "SmartRoom");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dgzsjtvo5/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};