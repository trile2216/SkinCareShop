import React, { useEffect, useState } from "react";
import DashboardTemplate from "../../components/templates/dashboardTemplate";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../config/axios";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
  },

  {
    title: "Category",
    dataIndex: "category",
    key: "category",
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
];

function ManageProduct() {
  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive"];

  const brandList = [
    { id: 1, name: "Brand A" },
    { id: 2, name: "Brand B" },
    { id: 3, name: "Brand C" },
  ];

  const categoryList = [
    { id: 1, name: "Category X" },
    { id: 2, name: "Category Y" },
    { id: 3, name: "Category Z" },
  ];

  const { Option } = Select;

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skintypes, setSkintypes] = useState([]);

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
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const formItems = (
    <>
      <FormItem
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Name can not be empty!",
          },
        ]}
      >
        <Input />
      </FormItem>
      <Form.Item
        label="Brand"
        name="brandId"
        rules={[{ required: true, message: "Brand cannot be empty!" }]}
      >
        <Select placeholder="Select a brand">
          {brandList.map((brand) => (
            <Option key={brand.id} value={brand.id}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Category"
        name="categoryId"
        rules={[{ required: true, message: "Category cannot be empty!" }]}
      >
        <Select placeholder="Select a category">
          {categoryList.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <FormItem label="Picture" name="picture">
        <Upload
          action="https://678511df1ec630ca33a711bb.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </FormItem>
      <FormItem
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
      </FormItem>
      <FormItem label="Stock" name="stock">
        <Input type="number" />
      </FormItem>
      <FormItem label="Sale" name="sale">
        <Input type="sale" />
      </FormItem>
      <FormItem
        label="Sale price"
        name="salePrice"
        rules={[
          {
            required: true,
            message: "Sale price must be number!",
          },
        ]}
      >
        <InputNumber min={0} step={1} style={{ width: "100%" }} />
      </FormItem>

      <Form.List name="productSkinTypes">
        {(fields, { add, remove }) => (
          <div style={{ marginBottom: 24 }}>
            <div className="flex justify-between items-center mb-4">
              <label className="font-medium">Skin Type Recommendations</label>
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
                <Form.Item label="Skin Type" name="skinType">
                  <Select placeholder="Select a skin type">
                    {skinTypes.map((type, index) => (
                      <Option key={index} value={type}>
                        {type}
                      </Option>
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
    </>
  );

  return (
    <div>
      <DashboardTemplate
        title={"Product"}
        columns={columns}
        uri={"products"}
        formItems={formItems}
      />
    </div>
  );
}

export default ManageProduct;
