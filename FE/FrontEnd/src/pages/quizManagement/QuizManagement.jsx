import React, { useState, useEffect } from "react";
import {
  Button,
  Upload,
  message,
  Radio,
  Spin,
  Table,
  Modal,
  Tabs,
  Tag,
  Space,
  Tooltip,
  Switch,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { quizService } from "../../services/quizService";

const { TabPane } = Tabs;

const QuizManagement = () => {
  const [fileType, setFileType] = useState("excel");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
      console.log(data.isActive);
    } catch (error) {
      message.error(
        `Failed to fetch quizzes: ${error.response?.data || error.message}`
      );
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // Load quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    setLoading(true);

    try {
      const response = await quizService.importQuiz(file, fileType);

      message.success("Quiz imported successfully!");
      onSuccess(response, file);
      // Refresh quiz list after successful import
      fetchQuizzes();
    } catch (error) {
      message.error(`Import failed: ${error.response?.data || error.message}`);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const blobData = await quizService.downloadTemplate();

      // Create URL for blob and download
      const url = window.URL.createObjectURL(new Blob([blobData]));
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

  // Handle viewing quiz details
  const viewQuizDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setDetailModalVisible(true);
  };

  // Handle setting quiz status (active/inactive)
  const handleSetQuizStatus = async (quizId, isActive) => {
    try {
      setLoadingQuizzes(true);
      await quizService.setQuizActiveStatus(quizId, isActive);
      message.success(
        isActive ? "Quiz set as active!" : "Quiz deactivated successfully"
      );

      fetchQuizzes();
    } catch (error) {
      message.error(
        `Failed to update quiz status: ${error.response?.data || error.message}`
      );
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, quiz) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => viewQuizDetails(quiz)}
            />
          </Tooltip>
          <Tooltip title={quiz.isActive ? "Currently Active" : "Set as Active"}>
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              checked={quiz.isActive}
              onChange={(checked) => handleSetQuizStatus(quiz.id, checked)}
              disabled={loadingQuizzes}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quiz Management</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane tab="Quiz List" key="1">
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="id"
            loading={loadingQuizzes}
            pagination={{ pageSize: 10 }}
            className="mb-6"
          />
        </TabPane>

        <TabPane tab="Import Quiz" key="2">
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
        </TabPane>
      </Tabs>

      {/* Quiz Detail Modal */}
      <Modal
        title={`Quiz Details: ${selectedQuiz?.title || ""}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedQuiz && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">General Information</h3>
              <p>
                <strong>ID:</strong> {selectedQuiz.id}
              </p>
              <p>
                <strong>Title:</strong> {selectedQuiz.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedQuiz.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedQuiz.isActive ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="default">Inactive</Tag>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Questions</h3>
              {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedQuiz.questions.map((question, index) => (
                    <li key={question.id} className="mb-4">
                      <p>
                        <strong>Question {index + 1}:</strong>{" "}
                        {question.questionText}
                      </p>
                      <p>
                        <strong>Options:</strong>
                      </p>
                      <ul className="list-circle pl-5">
                        {question.options &&
                          question.options.map((option) => (
                            <li key={option.id}>{option.optionText}</li>
                          ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No questions available</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizManagement;
