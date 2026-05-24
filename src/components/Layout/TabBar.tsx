import { Dropdown } from "antd";
import { CloseOutlined, SwapOutlined, BorderOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router";
import { useTabs } from "@/hooks/useTabs";
import type { Tab } from "../../types";
import styles from "./TabBar.module.css";

interface TabBarProps {
  tabs: Tab[];
  activeTabKey: string;
  onTabChange: (key: string) => void;
}

export function TabBar({ tabs, activeTabKey, onTabChange }: TabBarProps) {
  const navigate = useNavigate();
  const { removeTab } = useTabs();

  // 找到要激活的相邻 tab
  const findNextTabKey = (currentKey: string): string => {
    const currentIndex = tabs.findIndex((t) => t.key === currentKey);
    const rightTab = tabs[currentIndex + 1];
    const leftTab = tabs[currentIndex - 1];
    return rightTab?.key || leftTab?.key || "/dashboard";
  };

  const handleRemoveTab = (tabKey: string) => {
    if (tabKey === "/dashboard") return;

    // 如果删除的是当前激活的 tab，先找到下一个 tab
    let nextKey = tabKey;
    if (tabKey === activeTabKey) {
      nextKey = findNextTabKey(tabKey);
    }

    removeTab(tabKey);

    // 如果删除的是当前激活的 tab，导航到相邻 tab
    if (tabKey === activeTabKey) {
      navigate(nextKey);
    }
  };

  const handleEdit: MenuProps["onClick"] = ({ key }) => {
    const [action, tabKey] = key.split(":");
    if (action === "remove") {
      handleRemoveTab(tabKey);
    } else if (action === "closeOthers") {
      tabs.forEach((t) => {
        if (
          t.key !== tabKey &&
          t.closable !== false &&
          t.key !== "/dashboard"
        ) {
          removeTab(t.key);
        }
      });
      // If closing others on a non-active tab, switch to it
      if (tabKey !== activeTabKey) {
        navigate(tabKey);
      }
    } else if (action === "closeAll") {
      tabs.forEach((t) => {
        if (t.closable !== false && t.key !== "/dashboard") {
          removeTab(t.key);
        }
      });
      navigate("/dashboard");
    }
  };

  const getContextMenuItems = (tab: Tab): MenuProps["items"] => {
    const items: MenuProps["items"] = [];

    if (tab.key !== "/dashboard") {
      items.push({
        key: `remove:${tab.key}`,
        icon: <CloseOutlined />,
        label: "关闭当前页",
      });
    }

    items.push(
      { type: "divider" },
      {
        key: `closeOthers:${tab.key}`,
        icon: <SwapOutlined />,
        label: "关闭其他页",
      },
      {
        key: `closeAll:${tab.key}`,
        icon: <BorderOutlined />,
        label: "关闭所有页",
      },
    );

    return items;
  };

  const renderTabItem = (tab: Tab) => {
    const isActive = tab.key === activeTabKey;
    const hasClose = tab.closable !== false && tab.key !== "/dashboard";

    return (
      <Dropdown
        key={tab.key}
        menu={{ items: getContextMenuItems(tab), onClick: handleEdit }}
        trigger={["contextMenu"]}
      >
        <div
          className={`${styles.tabItem} ${tab.closable === false ? styles.fixed : ""} ${isActive ? styles.active : ""} ${hasClose ? styles.hasClose : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className={styles.tabTitleWrapper}>
            <span className={styles.tabTitle}>{tab.title}</span>
          </span>
          {hasClose && (
            <span
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTab(tab.key);
              }}
            >
              <CloseOutlined />
            </span>
          )}
        </div>
      </Dropdown>
    );
  };

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabList}>{tabs.map(renderTabItem)}</div>
    </div>
  );
}
