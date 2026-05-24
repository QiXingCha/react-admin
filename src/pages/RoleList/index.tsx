import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Tree,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DataNode } from "antd/es/tree";
import styles from "./RoleList.module.css";

interface RoleType {
  key: string;
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  status: "active" | "disabled";
  createTime: string;
}

const mockRoles: RoleType[] = [
  {
    key: "1",
    id: 1,
    name: "超级管理员",
    code: "SUPER_ADMIN",
    description: "拥有系统所有权限",
    userCount: 2,
    status: "active",
    createTime: "2025-01-01",
  },
  {
    key: "2",
    id: 2,
    name: "管理员",
    code: "ADMIN",
    description: "拥有大部分管理权限",
    userCount: 5,
    status: "active",
    createTime: "2025-01-15",
  },
  {
    key: "3",
    id: 3,
    name: "审计员",
    code: "AUDITOR",
    description: "查看系统日志和报表",
    userCount: 8,
    status: "active",
    createTime: "2025-02-01",
  },
  {
    key: "4",
    id: 4,
    name: "普通用户",
    code: "USER",
    description: "基础访问权限",
    userCount: 120,
    status: "active",
    createTime: "2025-03-01",
  },
];

const permissionData: DataNode[] = [
  {
    title: "用户管理",
    key: "user",
    children: [
      { title: "查看用户", key: "user:view" },
      { title: "创建用户", key: "user:create" },
      { title: "编辑用户", key: "user:edit" },
      { title: "删除用户", key: "user:delete" },
    ],
  },
  {
    title: "角色管理",
    key: "role",
    children: [
      { title: "查看角色", key: "role:view" },
      { title: "创建角色", key: "role:create" },
      { title: "编辑角色", key: "role:edit" },
      { title: "删除角色", key: "role:delete" },
    ],
  },
  {
    title: "系统设置",
    key: "system",
    children: [
      { title: "基本设置", key: "system:basic" },
      { title: "安全设置", key: "system:security" },
    ],
  },
];

export function RoleList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [form] = Form.useForm();

  console.log("render");

  const columns: ColumnsType<RoleType> = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
      render: (name: string, record) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <Tag color="default">{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "用户数",
      dataIndex: "userCount",
      key: "userCount",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: "active" | "disabled") => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status === "active" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 120,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => openPermissionModal(record)}
          >
            权限
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={record.code === "SUPER_ADMIN"}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const openEditModal = (role?: RoleType) => {
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const openPermissionModal = (role: RoleType) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log("保存:", values);
      message.success("保存成功");
      setIsModalOpen(false);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>角色管理</h1>
          <p className={styles.subtitle}>管理系统角色和权限配置</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openEditModal()}
        >
          新建角色
        </Button>
      </div>

      <Card className={styles.tableCard}>
        <Table columns={columns} dataSource={mockRoles} pagination={false} />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "编辑角色" : "新建角色"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            label="角色编码"
            name="code"
            rules={[{ required: true, message: "请输入角色编码" }]}
          >
            <Input placeholder="请输入角色编码，如 ADMIN" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`配置权限 - ${selectedRole?.name || ""}`}
        open={isPermissionModalOpen}
        onOk={() => {
          message.success("权限配置成功");
          setIsPermissionModalOpen(false);
        }}
        onCancel={() => setIsPermissionModalOpen(false)}
        width={500}
      >
        <div style={{ marginTop: 16 }}>
          <Tree
            checkable
            defaultExpandAll
            treeData={permissionData}
            defaultCheckedKeys={["user:view", "user:create", "role:view"]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default RoleList;
