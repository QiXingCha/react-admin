import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Divider,
  message,
  Tabs,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  SafetyOutlined,
  NotificationOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import styles from "./SystemSettings.module.css";

const { TextArea } = Input;

function SystemSettings() {
  const [basicForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const handleSave = (formName: string) => {
    message.success(`${formName} 保存成功`);
  };

  const tabItems = [
    {
      key: "basic",
      label: (
        <span>
          <GlobalOutlined />
          基本设置
        </span>
      ),
      children: (
        <Card className={styles.formCard}>
          <Form
            form={basicForm}
            layout="vertical"
            initialValues={{
              siteName: "后台管理系统",
              siteDescription: "一个高效、稳定的企业级后台管理解决方案",
              contactEmail: "admin@example.com",
              ICPNumber: "京ICP备12345678号",
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="系统名称" name="siteName">
                  <Input placeholder="请输入系统名称" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="联系邮箱" name="contactEmail">
                  <Input placeholder="请输入联系邮箱" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="系统描述" name="siteDescription">
              <TextArea rows={3} placeholder="请输入系统描述" />
            </Form.Item>
            <Form.Item label="ICP备案号" name="ICPNumber">
              <Input placeholder="请输入ICP备案号" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave("基本设置")}
              >
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <SafetyOutlined />
          安全设置
        </span>
      ),
      children: (
        <Card className={styles.formCard}>
          <Form
            form={securityForm}
            layout="vertical"
            initialValues={{
              passwordMinLength: 8,
              passwordExpireDays: 90,
              loginRetryLimit: 5,
              sessionTimeout: 30,
              enableCaptcha: true,
              enableTwoFactor: false,
            }}
          >
            <h3 className={styles.sectionTitle}>密码策略</h3>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="密码最小长度" name="passwordMinLength">
                  <Input type="number" min={6} max={32} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="密码有效期（天）" name="passwordExpireDays">
                  <Input type="number" min={7} max={365} />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <h3 className={styles.sectionTitle}>登录控制</h3>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="登录失败重试次数" name="loginRetryLimit">
                  <Input type="number" min={3} max={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="会话超时（分钟）" name="sessionTimeout">
                  <Input type="number" min={5} max={120} />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <h3 className={styles.sectionTitle}>认证选项</h3>
            <Form.Item
              label="启用验证码"
              name="enableCaptcha"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="启用双因素认证"
              name="enableTwoFactor"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave("安全设置")}
              >
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: "notification",
      label: (
        <span>
          <NotificationOutlined />
          通知设置
        </span>
      ),
      children: (
        <Card className={styles.formCard}>
          <Form
            form={notificationForm}
            layout="vertical"
            initialValues={{
              enableEmailNotify: true,
              enableSystemNotify: true,
              notifyOnError: true,
              notifyOnWarning: false,
            }}
          >
            <h3 className={styles.sectionTitle}>通知渠道</h3>
            <Form.Item
              label="启用邮件通知"
              name="enableEmailNotify"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="启用系统通知"
              name="enableSystemNotify"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Divider />

            <h3 className={styles.sectionTitle}>通知类型</h3>
            <Form.Item
              label="错误事件通知"
              name="notifyOnError"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="警告事件通知"
              name="notifyOnWarning"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave("通知设置")}
              >
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>系统设置</h1>
        <p className={styles.subtitle}>配置系统各项参数</p>
      </div>

      <Tabs items={tabItems} className={styles.tabs} />
    </div>
  );
}

export default SystemSettings;
