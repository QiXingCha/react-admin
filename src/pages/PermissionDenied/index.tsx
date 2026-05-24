import { Button, Result } from "antd";
import { useNavigate } from "react-router";
import styles from "./PermissionDenied.module.css";

function PermissionDenied() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有访问此页面的权限。"
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}

export default PermissionDenied;
