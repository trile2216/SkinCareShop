import { Button, Form, Input, Modal, Popconfirm, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import FormItem from "antd/es/form/FormItem";

function DashboardTemplate({ title, columns, uri, formItems }) {
  const [isOpen, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [newColumns, setNewColumns] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    const tableColumns = [
      ...columns,
      ...[
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
                    //   form.setFieldsValue(student);
                    //   if (student.avatar) {
                    //     setFileList([
                    //       {
                    //         name: "image.png",
                    //         status: "done",
                    //         url: student.avatar,
                    //       },
                    //     ]);
                    //   }
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title={`Delete the ${title}`}
                  description={`Are you sure to delete this ${title}?`}
                  onConfirm={() => console.log("delete")}
                >
                  <Button danger type="primary">
                    Delete
                  </Button>
                </Popconfirm>
              </>
            );
          },
        },
      ],
    ];
    setNewColumns(tableColumns);
  }, [newColumns]);

  const fetchDate = async () => {
    const response = await api.get(`${uri}`);
    setData(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchDate();
  }, []);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmitForm = () => {};

  return (
    <div>
      <Button onClick={handleOpenModal} type="primary">
        Create {title}
      </Button>
      <Table columns={newColumns} dataSource={data} />
      <Modal
        title={`Create new ${title}`}
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
          <FormItem label="Id" name="id" hidden>
            <Input />
          </FormItem>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
