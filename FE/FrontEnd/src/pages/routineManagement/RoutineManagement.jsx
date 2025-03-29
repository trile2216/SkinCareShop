import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Space,
    List,
    Select,
} from "antd";
import routineService from "../../services/api.routine";
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
const { Option } = Select;

const RoutineManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [filterTime, setFilterTime] = useState(""); // Lọc theo Time
    const [sortConfig, setSortConfig] = useState({ key: null, order: null }); // Sắp xếp
    
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRoutine, setCurrentRoutine] = useState(null);
    const [form] = Form.useForm();

    // Fetch routines data
    const fetchRoutines = async () => {
        setLoading(true);
        try {
            const data = await routineService.getAllRoutines();
            setRoutines(data);
        } catch (error) {
            message.error("Failed to fetch routines");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    // Handle edit routine
    const handleEdit = (routine) => {
        setCurrentRoutine(routine);
        form.setFieldsValue({
            skinTypeId: routine.skinTypeId,
            time: routine.time,
            name: routine.name,
            description: routine.description,
            steps: routine.steps || [], // Set steps for editing
        });
        setIsModalVisible(true);
    };

    // Handle adding a new step
    const handleAddStep = (values) => {
        const updatedSteps = [...(form.getFieldValue('steps') || []), values];
        form.setFieldsValue({ steps: updatedSteps });
    };

    // Handle deleting a step
    const handleDeleteStep = (index) => {
        const updatedSteps = form.getFieldValue('steps').filter((_, i) => i !== index);
        form.setFieldsValue({ steps: updatedSteps });
    };

    // Handle form submission for routine with steps
    const handleSubmit = async (values) => {
        const routineData = {
            skinTypeId: values.skinTypeId,
            time: values.time,
            name: values.name,
            description: values.description,
            steps: values.steps, // Include steps in the routine data
        };

        try {
            await routineService.saveRoutineWithSteps(
                currentRoutine ? currentRoutine.id : null,
                routineData
            );
            message.success(
                currentRoutine
                    ? "Routine updated successfully"
                    : "Routine created successfully"
            );
            fetchRoutines();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to save routine");
        }
    };

    // Handle delete routine
    const handleDelete = async (id) => {
        try {
            await routineService.deleteRoutine(id);
            message.success("Routine deleted successfully");
            fetchRoutines();
        } catch (error) {
            message.error("Failed to delete routine");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this routine?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

     // Hàm xử lý sắp xếp
     const handleSort = (key) => {
        let order = "asc";
        if (sortConfig.key === key && sortConfig.order === "asc") {
            order = "desc";
        }
        setSortConfig({ key, order });

        const sortedData = [...routines].sort((a, b) => {
            if (a[key] < b[key]) return order === "asc" ? -1 : 1;
            if (a[key] > b[key]) return order === "asc" ? 1 : -1;
            return 0;
        });

        setRoutines(sortedData);
    };

    // Lọc & Tìm kiếm
    const filteredRoutines = routines.filter((routine) =>
        ((routine.name?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
         (routine.time?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
         (String(routine.skinTypeId)?.toLowerCase() || "").includes(searchText.toLowerCase())) &&
        (filterTime ? routine.time === filterTime : true)
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Routine Management</h2>
            <Button
                style={{backgroundColor: "#fda4af"}}
                type="primary"
                onClick={() => {
                    setCurrentRoutine(null);
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Create Routine
            </Button>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" , marginTop: "20px"}}>
                {/*Search Bar */}
                <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width: 200,
                        border: "2px solid #fda4af",
                        color: "#fda4af",
                    }}
                />

                {/* Lọc theo Time */}
                <Select
                    placeholder="Filter by Time"
                    style={{ width: 150, borderColor: "#fda4af", color: "##fda4af" }}
                    allowClear
                    value={filterTime}
                    onChange={(value) => setFilterTime(value)}
                >
                    <Option value="Morning">Morning</Option>
                    <Option value="Night">Night</Option>
                </Select>

                {/* ⬆️⬇️ Sắp xếp */}
                <Button onClick={() => handleSort("id")}  style={{  borderColor: "#fda4af", color: "#fda4af" }}>
                    Sort by ID {sortConfig.key === "id" && (sortConfig.order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredRoutines}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="mt-4"
            />

            {/* Routine Modal */}
            <Modal
                title={currentRoutine ? "Edit Routine" : "Create Routine"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="skinTypeId"
                        label="Skin Type ID"
                        rules={[{ required: true, message: "Please enter skin type ID" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Time"
                        rules={[{ required: true, message: "Please enter time" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please enter name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {/* Steps Management */}
                    <Form.List
                        name="steps"
                        initialValue={currentRoutine ? currentRoutine.steps : []}
                        rules={[
                            {
                                validator: async (_, steps) => {
                                    if (!steps || steps.length < 1) {
                                        return Promise.reject(
                                            new Error("At least 1 step required")
                                        );
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            fieldKey={[fieldKey, "name"]}
                                            rules={[
                                                { required: true, message: "Step name is required" },
                                            ]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="Step Name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "description"]}
                                            fieldKey={[fieldKey, "description"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Step description is required",
                                                },
                                            ]}
                                            style={{ flex: 2 }}
                                        >
                                            <Input.TextArea placeholder="Step Description" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "stepOrder"]}
                                            fieldKey={[fieldKey, "stepOrder"]}
                                            rules={[
                                                { required: true, message: "Step order is required" },
                                            ]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input type="number" placeholder="Order" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "categoryId"]}
                                            fieldKey={[fieldKey, "categoryId"]}
                                            rules={[
                                                { required: true, message: "Category ID is required" },
                                            ]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input type="number" placeholder="Category ID" />
                                        </Form.Item>
                                        <Button type="link" onClick={() => remove(name)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Step
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoutineManagement;
