import { Form, Input, Modal, Button } from 'antd';
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 56,
        },
        sm: {
            span: 14,
        },
    },
};

const RowModal = ({ isModalOpen, handleCancel, handleRowCountSubmit }) => {
    const [form] = Form.useForm();
    const handleOk = () => {
        form.submit(); // Triggers the onFinish function
      };
      const onFinish = (values) => {
        console.log('Form Values:', values);
        handleRowCountSubmit(values);
        handleCancel(); // Close the modal after submission
      };
    return (
        <Modal
            title="Add Multiple Rows"
            open={isModalOpen}
            onOk={handleRowCountSubmit}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button type="primary" onClick={handleOk}>
                    Submit
                </Button>
            ]}
        >
            <Form
                {...formItemLayout}
                form={form}
                variant="outlined"
                onFinish={onFinish}
                initialValues={{
                    rowsCount: ''
                }}
            >
                {/*ag-data-grid takes Header Name as headerName key while constructing columns*/}
                <Form.Item
                    label="Rows Count"
                    name="rowsCount"
                    rules={[
                        {
                            required: true,
                            message: 'Please Add Number of Rows to add',
                        },
                    ]}
                >
                    <Input placeholder='Add Numbers of Rows to add'/>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default RowModal;