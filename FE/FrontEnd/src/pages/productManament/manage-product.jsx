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
  Space,
} from "antd";
import { getCategories } from "../../services/api.category";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { getSkinTypes } from "../../services/api.skintype";
import { getBrands } from "../../services/api.brand";
import FormItem from "antd/es/form/FormItem";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadImage } from "../../services/api.image";

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

  const handleEdit = (record) => {
    setOpen(true);
    const formattedSkinTypes = record.productSkinTypes.map((st) => ({
      skinTypeId: st.skinTypeId,
      recommentedLevel: st.recommentedLevel,
    }));

    form.setFieldsValue({
      id: record.id,
      name: record.name,
      ingredient: record.ingredient,
      image: record.image,
      gender: record.gender,
      stock: record.stock,
      description: record.description,
      categoryId: record.categoryId,
      brandId: record.brandId,
      sale: record.sale,
      price: record.price,
      skinTypes: formattedSkinTypes,
    });

    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
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
      render: (sale) => `${sale}%`,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={100} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={() => handleDeteleProduct(record.id)}
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeteleProduct = async (id) => {
    const response = await deleteProduct(id);

    if (response) {
      fetchProduct();
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      const productData = {
        ...formValues,
        image: formValues.image, // Sử dụng URL hình ảnh từ form
        stock: parseInt(formValues.stock),
        sale: parseInt(formValues.sale) || 0,
        price: parseFloat(formValues.price),
        status: true,
        productSkinTypes: formValues.skinTypes.map((st) => ({
          skinTypeId: parseInt(st.skinTypeId),
          recommentedLevel: parseInt(st.recommentedLevel),
        })),
      };

      if (formValues.id) {
        await updateProduct({
          id: formValues.id,
          product: productData,
        });
        toast.success("Successfully updated product");
      } else {
        await createProduct(productData);
        toast.success("Successfully created new product");
      }
      setOpen(false);
      form.resetFields();
      setFileList([]);
      fetchProduct();
    } catch (error) {
      toast.error("Error saving product");
      console.error(error);
    }
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
        title={form.getFieldValue("id") ? "Edit Product" : "Create Product"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        onOk={() => form.submit()}
        width={800}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Category is required!" }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option value={category.id} key={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brandId"
            rules={[{ required: true, message: "Brand is required!" }]}
          >
            <Select>
              {brands.map((brand) => (
                <Select.Option value={brand.id} key={brand.id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Gender" name="gender" initialValue="Unisex">
            <Select>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Unisex">Unisex</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Image is required!" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              onPreview={handlePreview}
              onChange={async (info) => {
                const { fileList: newFileList } = info;
                setFileList(newFileList);

                if (info.file.status === "uploading") {
                  return;
                }
                if (info.file.status === "done") {
                  // Get image URL from response
                  form.setFieldValue("image", info.file.response.url);
                }
              }}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const result = await uploadImage(file);
                  onSuccess(result);
                } catch (error) {
                  onError(error);
                }
              }}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  toast.error("You can only upload image files!");
                  return false;
                }
                return true; // Allow upload
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.List
            name="skinTypes"
            rules={[
              {
                validator: async (_, skinTypes) => {
                  if (!skinTypes || skinTypes.length < 1) {
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
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{ display: "flex", marginBottom: 8, gap: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "skinTypeId"]}
                      rules={[{ required: true, message: "Select skin type" }]}
                      style={{ flex: 2 }}
                    >
                      <Select placeholder="Select skin type">
                        {skinTypes.map((type) => (
                          <Select.Option key={type.id} value={type.id}>
                            {type.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "recommentedLevel"]}
                      rules={[
                        { required: true, message: "Enter level" },
                        {
                          type: "number",
                          min: 1,
                          max: 5,
                          message: "Level must be 1-5",
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Select placeholder="Select level">
                        <Select.Option value={1}>1</Select.Option>
                        <Select.Option value={2}>2</Select.Option>
                        <Select.Option value={3}>3</Select.Option>
                        <Select.Option value={4}>4</Select.Option>
                        <Select.Option value={5}>5</Select.Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Skin Type
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is required!" }]}
          >
            <Input type="number" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Stock is required!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item label="Sale (%)" name="sale" initialValue={0}>
            <Input type="number" min={0} max={100} />
          </Form.Item>

          <Form.Item label="Ingredients" name="ingredient">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default ManageProduct;
