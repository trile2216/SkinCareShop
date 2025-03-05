import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  Space,
  InputNumber,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import uploadFile from "../../utils/upload";

const ProductManagement = () => {
  const [studentList, setStudentList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [form] = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={75} />,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
    },
    {
      title: "Sale price",
      key: "salePrice",
      render: (text, record) => {
        const salePrice = record.price - (record.price * record.sale) / 100;
        return `$${salePrice.toFixed(2)}`;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, order) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue(order);
                if (order.image) {
                  setFileList([
                    {
                      name: "image.png",
                      status: "done",
                      url: order.image,
                    },
                  ]);
                }
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the order"
              description="Are you sure to delete this order?"
              onConfirm={() => handleDeleteOrder(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleDeleteOrder = async (id) => {
    await api.delete(`/product/${id}`);
    toast.success("Delete Successfully!");
    fetchOrders();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const fetchOrders = async () => {
    const response = await api.get("/product");
    setStudentList(response.data);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmitForm = async (value) => {
    try {
      if (value.image?.file?.originFileObj) {
        const url = await uploadFile(value.image.file.originFileObj);
        value.image = url;
      }

      if (!Array.isArray(value.productSkinTypes)) {
        value.productSkinTypes = [];
      }

      if (value.id) {
        await api.put(`/product/${value.id}`, value);
      } else {
        await api.post("/product", value);
      }

      toast.success("Successfully!");
      handleCloseModal();
      fetchOrders();
      form.resetFields();
    } catch (error) {
      toast.error("An error occurred!");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const response = await api.get("/skintype");
        setSkinTypes(response.data);
      } catch (error) {
        console.error("Error fetching skin types:", error);
      }
    };
    fetchSkinTypes();
    fetchOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>Product Management</h1>
      <Button onClick={handleOpenModal}>Add new Product</Button>
      <Table dataSource={studentList} columns={columns} />
      <Modal
        title="Create new product"
        open={isOpen}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        width={800}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmitForm}
        >
          <Form.Item label="Id" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name cannot be empty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ingredient"
            name="ingredient"
            rules={[
              {
                required: true,
                message: "Ingredient cannot be empty!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Price cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Sale" name="sale">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Stock" name="stock">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Category cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brandId"
            rules={[
              {
                required: true,
                message: "Brand cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              action="http://localhost:5286/api/image/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Input />
          </Form.Item>

          <Form.List name="productSkinTypes">
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: 24 }}>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-medium">
                    Skin Type Recommendations
                  </label>
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Skin Type
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "skinTypeId"]}
                      rules={[{ required: true, message: "Missing skin type" }]}
                    >
                      <Select
                        placeholder="Select skin type"
                        style={{ width: 200 }}
                      >
                        {skinTypes.map((type) => (
                          <Select.Option key={type.id} value={type.id}>
                            {type.symbol}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "recommentedLevel"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing recommendation level",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Recommendation Level (1-5)"
                        min={1}
                        max={5}
                        style={{ width: 200 }}
                      />
                    </Form.Item>

                    <Button type="text" danger onClick={() => remove(name)}>
                      Delete
                    </Button>
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default ProductManagement;
