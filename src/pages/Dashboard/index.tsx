import { Card, Row, Col, Statistic, Table, Tag, Progress } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "./Dashboard.module.css";

interface DataType {
  key: string;
  name: string;
  status: "active" | "pending" | "inactive";
  revenue: number;
  lastActive: string;
}

const recentOrders: DataType[] = [
  {
    key: "1",
    name: "张三",
    status: "active",
    revenue: 12800,
    lastActive: "2026-05-07 10:30",
  },
  {
    key: "2",
    name: "李四",
    status: "pending",
    revenue: 5600,
    lastActive: "2026-05-07 09:15",
  },
  {
    key: "3",
    name: "王五",
    status: "inactive",
    revenue: 3200,
    lastActive: "2026-05-06 18:45",
  },
  {
    key: "4",
    name: "赵六",
    status: "active",
    revenue: 18900,
    lastActive: "2026-05-07 11:20",
  },
];

const statusMap = {
  active: { color: "green", text: "活跃" },
  pending: { color: "orange", text: "待处理" },
  inactive: { color: "default", text: "不活跃" },
};

const columns: ColumnsType<DataType> = [
  {
    title: "用户",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: "active" | "pending" | "inactive") => (
      <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
    ),
  },
  {
    title: "收益",
    dataIndex: "revenue",
    key: "revenue",
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: "最近活跃",
    dataIndex: "lastActive",
    key: "lastActive",
  },
];

function Dashboard() {
  console.log("11");
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>数据概览</h1>
        <p className={styles.subtitle}>欢迎使用后台管理系统</p>
      </div>

      <Row gutter={[16, 16]} className={styles.stats}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="总用户数"
              value={12580}
              prefix={<UserOutlined />}
              suffix={
                <span className={styles.suffix}>
                  <RiseOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="今日订单"
              value={328}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <span className={styles.suffix}>
                  <RiseOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="总收入"
              value={`¥${(892400).toLocaleString()}`}
              prefix={<DollarOutlined />}
              suffix={
                <span className={styles.suffix}>
                  <RiseOutlined /> 23%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="转化率"
              value={68}
              prefix={<AreaChartOutlined />}
              suffix={
                <span className={styles.suffix}>
                  <RiseOutlined /> 5%
                </span>
              }
              formatter={(value) => `${value}%`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="最近订单"
            extra={<a href="/orders">查看全部</a>}
            className={styles.tableCard}
          >
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="销售目标" className={styles.targetCard}>
            <div className={styles.targetItem}>
              <div className={styles.targetHeader}>
                <span>月度目标</span>
                <span>78%</span>
              </div>
              <Progress percent={78} strokeColor="#1677ff" />
            </div>
            <div className={styles.targetItem}>
              <div className={styles.targetHeader}>
                <span>季度目标</span>
                <span>45%</span>
              </div>
              <Progress percent={45} strokeColor="#52c41a" />
            </div>
            <div className={styles.targetItem}>
              <div className={styles.targetHeader}>
                <span>年度目标</span>
                <span>32%</span>
              </div>
              <Progress percent={32} strokeColor="#faad14" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
