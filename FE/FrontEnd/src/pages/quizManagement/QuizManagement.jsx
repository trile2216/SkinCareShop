import React, { useState } from "react";
import { Button, Upload, message, Radio, Spin } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const QuizManagement = () => {
  const [fileType, setFileType] = useState("excel");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const endpoint =
        fileType === "excel" ? "/quiz/import/excel" : "/quiz/import/csv";
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Quiz imported successfully!");
      onSuccess(response, file);
    } catch (error) {
      message.error(`Import failed: ${error.response?.data || error.message}`);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get("/quiz/download-template", {
        responseType: "blob",
      });

      // Tạo URL cho blob và tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quiz_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Import Quiz</h2>

      <div className="mb-6">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadTemplate}
        >
          Download Template
        </Button>
      </div>

      <div className="mb-4">
        <Radio.Group
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <Radio.Button value="excel">Excel</Radio.Button>
          <Radio.Button value="csv">CSV</Radio.Button>
        </Radio.Group>
      </div>

      <Upload
        customRequest={handleUpload}
        accept={fileType === "excel" ? ".xlsx" : ".csv"}
        showUploadList={true}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />} loading={loading}>
          Upload {fileType === "excel" ? "Excel" : "CSV"} File
        </Button>
      </Upload>

      {loading && (
        <div className="mt-4 flex justify-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
