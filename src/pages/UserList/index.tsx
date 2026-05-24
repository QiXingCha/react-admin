import { useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useUserList } from "@/api/user";
import type { UserInfo } from "@/types";
import styles from "./UserList.module.css";

type UserRow = UserInfo & { email?: string };

function UserList() {
  const [searchText, setSearchText] = useState("");

  const { data } = useUserList();

  const columns: ColumnsType<UserRow> = [
    {
      title: "用户",
      dataIndex: "username",
      key: "username",
    },

    {
      title: "操作",
      key: "action",
      width: 150,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Popconfirm title="确定删除此用户？" okText="确定" cancelText="取消">
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>用户管理</h1>
          <p className={styles.subtitle}>管理系统用户账号</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          新建用户
        </Button>
      </div>

      <div className={styles.toolbar}>
        <Input
          placeholder="搜索用户名或邮箱..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data || []}
        pagination={{
          total: data?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        className={styles.table}
      />
    </div>
  );
}
export default UserList;
