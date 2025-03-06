import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../services/api.product";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Upload,
} from "antd";
import { getCategories } from "../../services/api.category";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { getSkinTypes } from "../../services/api.skintype";
import { getBrands } from "../../services/api.brand";
import FormItem from "antd/es/form/FormItem";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [open, setOpen] = useState(false);
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
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  // CRUD

  const fetchProduct = async () => {
    const data = await getProduct();
    setProducts(data);
  };
  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };
  const fetchSkinTypes = async () => {
    const data = await getSkinTypes();
    setSkinTypes(data);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  // get product
  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchSkinTypes();
    fetchBrands();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "descripton",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Ingerdients",
      dataIndex: "ingredient",
      key: "ingredient",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={100} />,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue({
                  ...record,
                  categoryID: record?.categories
                    ? record?.categories?.map((item) => item.id)
                    : [],
                });
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the product"
              description="Are you sure to delete this product?"
              onConfirm={() => handleDeteleProduct(id)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleDeteleProduct = async (id) => {
    const response = await deleteProduct(id);

    if (response) {
      fetchProduct();
    }
  };

  const handleSubmit = async (formValues) => {
    formValues.image = "123";
    // co id thi update
    if (formValues.id) {
      const response = await updateProduct({
        id: formValues.id,
        product: formValues,
      });
      console.log(response);
      toast.success("Successfilly update product");
    }
    // nguoc lai ko co thi la create
    else {
      const response = await createProduct(formValues);
      console.log(response);
      toast.success("Successfilly create new  product");
    }
    setOpen(false);
    form.resetFields();
    fetchProduct();
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Create new product
      </Button>
      <Table
        dataSource={products.filter((product) => !product.deleted)}
        columns={columns}
      />

      <Modal
        title="Product"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
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
                message: "Name is required!",
              },
              {
                min: 3,
                message: "Name must be at least 3 characters!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Price is required!",
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
                message: "Stock is required!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Category ID"
            name="categoryID"
            rules={[
              {
                required: true,
                message: "At least one category must be selected!",
              },
            ]}
          >
            <Select mode="multiple">
              {categories.map((category) => (
                <Select.Option value={category.id} key={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Brand ID"
            name="BrandID"
            rules={[
              {
                required: true,
                message: "At least one Brand must be selected!",
              },
            ]}
          >
            <Select mode="multiple">
              {categories.map((Brand) => (
                <Select.Option value={Brand.id} key={Brand.id}>
                  {Brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required!",
              },
              {
                min: 5,
                message: "Description must be at least 5 characters!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <FormItem label="Image" name="imagee">
            <Upload
              action="/image/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </FormItem>
          <Form.List
            name="skinTypes"
            rules={[
              {
                validator: async (_, types) => {
                  if (!types || types.length < 1) {
                    return Promise.reject(
                      new Error("At least 1 skin type required")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? "Skin Types" : ""}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please select a skin type or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Select style={{ width: "60%" }}>
                        {skinTypes.map((type) => (
                          <Select.Option key={type.id} value={type.id}>
                            {type.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "60%" }}
                    icon={<PlusOutlined />}
                  >
                    Add Skin Type
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            label="Recommend Level"
            name="recommendLevel"
            rules={[
              {
                required: true,
                message: "Recommend level is required!",
              },
              {
                type: "number",
                min: 3,
                max: 5,
                message: "Recommend level must be between 3 and 5!",
              },
            ]}
          >
            <Input type="number" min={3} max={5} />
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
}

export default ManageProduct;
