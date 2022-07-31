import { Modal, Form, Input, Button } from "antd";
import { getAxiosUrl, getIMUrl, getAdminUrl } from "../../../config";

const IMConfigModal = ({ visible, close }: { visible: boolean; close: () => void }) => {
  const [form] = Form.useForm();

  const getIntialValues = () => {
    if (window.electron) {
      return {
        AxiosUrl: getAxiosUrl(),
        AdminUrl: getAdminUrl(),
        ...window.electron.getIMConfig(),
      };
    } else {
      return {
        AxiosUrl: getAxiosUrl(),
        IMUrl: getIMUrl(),
        AdminUrl: getAdminUrl(),
      };
    }
  };

  const setFinish = (values: any) => {
    if (!window.electron) {
      localStorage.setItem("IMUrl", values.IMUrl);
    }else{
      window.electron.setIMConfig(values);
    }
    localStorage.setItem("IMAxiosUrl", values.AxiosUrl);
    localStorage.setItem("IMAdminUrl", values.AdminUrl);
    
    window.location.reload();
  };

  return (
    <Modal footer={null} title="修改配置" visible={visible} onCancel={close}>
      <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={getIntialValues()} onFinish={setFinish} autoComplete="off">
        {!window.electron && (
          <Form.Item label="IMUrl" name="IMUrl" rules={[{ required: true, message: "Please input your IMUrl!" }]}>
            <Input />
          </Form.Item>
        )}

        <Form.Item label="AxiosUrl" name="AxiosUrl" rules={[{ required: true, message: "Please input your AxiosUrl!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="AdminUrl" name="AdminUrl" rules={[{ required: true, message: "Please input your AdminUrl!" }]}>
          <Input />
        </Form.Item>

        {window.electron && (
          <>
            <Form.Item label="IMApiAddress" name="IMApiAddress" rules={[{ required: true, message: "Please input your IMApiAddress!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="IMWsAddress" name="IMWsAddress" rules={[{ required: true, message: "Please input your IMWsAddress!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="IMWsPort" name="IMWsPort" rules={[{ required: true, message: "Please input your AdminUrl!" }]}>
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IMConfigModal;
