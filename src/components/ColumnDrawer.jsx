import React, { useEffect } from 'react';
import { Button, Col, Drawer, Form, Input, Space, Row } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const ColumnDrawer = ({ open, onClose, handleSubmit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            // Reset form when the drawer is opened
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = () => {
        form.submit();
    };

    const onFinish = (values) => {
        console.log('Form Values:', values); // Debugging
        if (Array.isArray(values.fields)) {
            handleSubmit(values.fields);
        } else {
            console.error('Fields is not an array:', values.fields); // Debugging
        }
        onClose();
    };

    return (
        <Drawer
            title="Add Columns"
            width={720}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleOk} type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{
                    fields: [{ headerName: '', field: '' }],
                }}
            >
                <Form.List name="fields">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Row gutter={16} key={key} align="middle">
                                    <Col span={11}>
                                        {/* ag-data-grid takes Header Name as headerName key while constructing columns */}
                                        <Form.Item
                                            {...restField}
                                            label="Header Name"
                                            name={[name, 'headerName']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please Add a Header Name for Column!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        {/* ag-data-grid takes field which is directly mapped with rowdata to fill data in columns */}
                                        <Form.Item
                                            {...restField}
                                            label="Field Name"
                                            name={[name, 'field']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please Add a Unique Field Name for Column!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    {fields.length > 1 && (
                                        <Col span={2} style={{ textAlign: 'center' }}>
                                            <Button
                                                type="link"
                                                icon={<CloseOutlined />}
                                                onClick={() => remove(name)}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                    Add Field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Drawer>
    );
};

export default ColumnDrawer;