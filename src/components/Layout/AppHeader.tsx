import { Layout, Breadcrumb, Dropdown, Avatar, Space, Modal } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useAliveRef } from "@/contexts/KeepAliveContext";
import styles from "./AppHeader.module.css";

const { Header } = Layout;

interface AppHeaderProps {
  breadcrumbItems: { title: string }[];
}

export function AppHeader({ breadcrumbItems }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const aliveRef = useAliveRef();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      Modal.confirm({
        title: "确认退出登录？",
        content: "退出后需要重新登录才能继续访问系统。",
        okText: "退出",
        cancelText: "取消",
        okButtonProps: { danger: true },
        onOk: async () => {
          await aliveRef.current?.destroyAll();
          await logout();
        },
      });
    } else if (key === "settings") {
      navigate("/settings");
    }
  };

  return (
    <Header className={styles.header}>
      <div className={styles.left}>
        <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
      </div>
      <div className={styles.right}>
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
        >
          <Space className={styles.userInfo}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span className={styles.username}>
              {user?.nickname || user?.username || "Guest"}
            </span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
