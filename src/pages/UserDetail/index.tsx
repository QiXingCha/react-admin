import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Tag,
  Avatar,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import styles from "./UserDetail.module.css";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
}

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (values: UserFormData) => {
    console.log("保存用户:", values);
    message.success("保存成功");
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/users")}
          className={styles.backBtn}
        >
          返回用户列表
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <Avatar size={80} style={{ backgroundColor: "#1677ff" }}>
                {id || "U"}
              </Avatar>
              <h2 className={styles.profileName}>用户 #{id}</h2>
              <Tag color="blue">管理员</Tag>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>128</span>
                <span className={styles.statLabel}>操作次数</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>角色变更</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15</span>
                <span className={styles.statLabel}>登录天数</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="基本信息"
            extra={
              !isEditing && (
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  编辑资料
                </Button>
              )
            }
            className={styles.formCard}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: "张伟",
                email: "zhangwei@example.com",
                phone: "138****8888",
                department: "技术部",
                role: "管理员",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="姓名"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "请输入姓名",
                      },
                    ]}
                  >
                    <Input disabled={!isEditing} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "请输入邮箱",
                      },
                      {
                        type: "email",
                        message: "请输入有效邮箱",
                      },
                    ]}
                  >
                    <Input disabled={!isEditing} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="手机号" name="phone">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="部门" name="department">
                    <Input disabled={!isEditing} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="角色" name="role">
                    <Input disabled={!isEditing} />
                  </Form.Item>
                </Col>
              </Row>

              {isEditing && (
                <div className={styles.formActions}>
                  <Button onClick={handleCancel}>取消</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                  >
                    保存
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserDetail;
