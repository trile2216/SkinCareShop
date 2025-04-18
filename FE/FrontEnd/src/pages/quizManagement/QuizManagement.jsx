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
  Collapse,
  Typography,
  Card,
  Divider,
  Result,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { quizService } from "../../services/quizService";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const QuizManagement = () => {
  const [fileType, setFileType] = useState("excel");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [importResultModalVisible, setImportResultModalVisible] =
    useState(false);
  const [importResult, setImportResult] = useState({
    success: false,
    message: "",
    details: null,
  });

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      message.error(
        `Failed to fetch quizzes: ${error.response?.data?.error || error.message
        }`
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

      setImportResult({
        success: true,
        message: "Quiz imported successfully!",
        details: response.data,
      });
      setImportResultModalVisible(true);

      onSuccess(response, file);
      fetchQuizzes();
    } catch (error) {
      setImportResult({
        success: false,
        message: "Import failed",
        details: error.response?.data?.error || error.message,
      });
      setImportResultModalVisible(true);

      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const blobData = await quizService.downloadTemplate();

      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `quiz_template.${fileType === "excel" ? "xlsx" : "csv"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error(`Download failed: ${error.message}`);
    }
  };

  const viewQuizDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setDetailModalVisible(true);
  };

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
        `Failed to update quiz status: ${error.response?.data?.error || error.message
        }`
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
      title: "Skin Quizzes",
      key: "skinQuizzesCount",
      render: (_, record) => record.skinQuizzes?.length || 0,
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

  const renderQuizDetails = () => {
    if (!selectedQuiz) return null;

    return (
      <div className="quiz-details">
        <div className="mb-4">
          <Title level={4}>Main Quiz ID: {selectedQuiz.id}</Title>
          <Text type="secondary">
            Contains {selectedQuiz.skinQuizzes?.length || 0} skin element
            quizzes
          </Text>
        </div>

        <Divider />

        <Collapse defaultActiveKey={["0"]} className="mb-4">
          {selectedQuiz.skinQuizzes?.map((skinQuiz, skinQuizIndex) => (
            <Panel
              header={<strong>{skinQuiz.skinElement}</strong>}
              key={skinQuizIndex}
            >
              {skinQuiz.questions?.map((question, questionIndex) => (
                <Card
                  key={question.id}
                  title={`Question ${questionIndex + 1}: ${question.content}`}
                  className="mb-4"
                  type="inner"
                  size="small"
                >
                  <ul className="pl-5 list-none w-full">
                    {question.answers?.map((answer) => (
                      <li
                        key={answer.id}
                        className="mb-2 flex justify-between items-center "
                      >
                        <div className="answer-content">{answer.content}</div>
                        <Tag color="blue" className="ml-auto">
                          Score: {answer.score}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  const renderImportResultModal = () => {
    return (
      <Modal
        title={importResult.success ? "Import Successful" : "Import Failed"}
        open={importResultModalVisible}
        onCancel={() => setImportResultModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setImportResultModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        <Result
          status={importResult.success ? "success" : "error"}
          title={importResult.message}
          subTitle={
            <div className="mt-4">
              {importResult.success ? (
                <div>
                  <Paragraph>
                    The quiz has been successfully imported and is now available
                    in the quiz list.
                  </Paragraph>
                </div>
              ) : (
                <div>
                  <Paragraph>
                    There was an error during the import process. Please check
                    the details below:
                  </Paragraph>
                </div>
              )}
            </div>
          }
        />
      </Modal>
    );
  };

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

      <Modal
        title="Quiz Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {renderQuizDetails()}
      </Modal>

      {renderImportResultModal()}
    </div>
  );
};

export default QuizManagement;
