import React, { useState, useImperativeHandle, forwardRef } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import { uploadFileCloudinary } from "../../utils/upload";

const ImageUpload = forwardRef(({ onImageUploaded, initialImage }, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
        return;
      }

      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!acceptedTypes.includes(file.type)) {
        setError("Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP).");
        return;
      }

      setError("");
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return initialImage || null; 
    }

    try {
      setIsUploading(true);
      setError("");
      setUploadProgress(0);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);
      
      const downloadUrl = await uploadFileCloudinary(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (onImageUploaded) {
        onImageUploaded(downloadUrl);
      }
      
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setError("Không thể tải ảnh lên. Vui lòng thử lại.");
      return initialImage || null;
    } finally {
      setIsUploading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleUpload
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <FiImage className="inline mr-2" /> Hình ảnh
      </label>
      
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUploadCloud className="w-8 h-8 mb-3 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP hoặc GIF (Tối đa 5MB)</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      
      {previewImage && (
        <div className="mt-3 border rounded-lg p-2 bg-gray-50 relative group">
          <img
            src={previewImage}
            alt="Preview"
            className="h-40 object-cover rounded-lg mx-auto"
          />
          {!isUploading && (
            <button 
              type="button"
              onClick={() => {
                setPreviewImage(null);
                setSelectedFile(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;