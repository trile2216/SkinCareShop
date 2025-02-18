import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "./utils/upload";

const ProductManagement = () => {
  const [studentList, setStudentList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [form] = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    await axios.delete(
      `https://678511df1ec630ca33a711bb.mockapi.io/product/${id}`
    );
    toast.success("Delete order successfully!");
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
    const response = await axios.get(
      "https://678511df1ec630ca33a711bb.mockapi.io/product"
    );
    setStudentList(response.data);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmitForm = async (value) => {
    console.log(value);

    //upload ảnh lên firebase storage
    if (value.image.file?.originFileObj) {
      const url = await uploadFile(value.image.file.originFileObj);
      value.image = url;
    }

    if (value.id) {
      //update
      await axios.put(
        `https://678511df1ec630ca33a711bb.mockapi.io/product/${value.id}`,
        value
      );
    } else {
      //create
      await axios.post(
        "https://678511df1ec630ca33a711bb.mockapi.io/product",
        value
      );
    }
    toast.success("Create order successfully!");
    handleCloseModal();
    fetchOrders();
    form.resetFields();
  };

  //event => chạy khi page vừa load lên
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>Order Management</h1>
      <Button onClick={handleOpenModal}>Add new Order</Button>
      <Table dataSource={studentList} columns={columns} />
      <Modal
        title="Create new order"
        open={isOpen}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
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
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Quantity cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Sale"
            name="sale"
            rules={[
              {
                required: true,
                message: "Quantity cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              {
                required: true,
                message: "Stock cannot be empty!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Category ID"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Category ID cannot be empty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brand"
            rules={[
              {
                required: true,
                message: "Brand cannot be empty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Status cannot be empty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
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
