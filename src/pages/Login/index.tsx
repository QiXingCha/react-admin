import { useState } from "react";
import { Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { login as loginApi } from "@/api/auth";
import styles from "./Login.module.css";

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

interface LocationState {
  from?: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: "admin",
    password: "123456",
    remember: false,
  });

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      return;
    }
    setLoading(true);
    try {
      const response = await loginApi({
        username: formData.username,
        password: formData.password,
      });
      const user = response.user;

      login({ token: response.token, user });
      setLoading(false);

      const from = (location.state as LocationState | null)?.from;
      navigate(from || "/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel - Branding */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.wordmark}>
            <div className={styles.wordmarkIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={styles.wordmarkText}>AdminHub</span>
          </div>

          <h1 className={styles.heroHeadline}>
            Modern admin dashboard for the AI era
          </h1>
          <p className={styles.heroSubtitle}>
            Streamline your workflow with intelligent role-based access control
            and persistent tabbed navigation.
          </p>
        </div>

        {/* IDE Mockup Decoration */}
        <div className={styles.ideDecoration}>
          <div className={styles.ideWindow}>
            <div className={styles.ideTitleBar}>
              <span className={styles.ideDot} />
              <span className={styles.ideDot} />
              <span className={styles.ideDot} />
            </div>
            <div className={styles.ideContent}>
              <span className={styles.comment}>{`// Authentication flow`}</span>
              <br />
              <span className={styles.keyword}>const</span> <span>user</span> ={" "}
              <span className={styles.keyword}>await</span>{" "}
              <span>authenticate</span>(credentials);
              <br />
              <span className={styles.keyword}>if</span>{" "}
              <span>(user.role === </span>
              <span className={styles.string}>"admin"</span>
              <span>) {"{"}</span>
              <br />
              &nbsp;&nbsp;<span>grantAccess</span>();
              <br />
              <span>{"}"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Sign in to your account</h2>
            <p className={styles.loginDesc}>
              Enter your credentials to access the dashboard
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Username</label>
              <Input
                className={styles.input}
                placeholder="Enter your username"
                prefix={<UserOutlined style={{ color: "#807d72" }} />}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <Input.Password
                className={styles.input}
                placeholder="Enter your password"
                prefix={<LockOutlined style={{ color: "#807d72" }} />}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className={styles.signupRow}>
            <span>Don't have an account?</span>
            <a href="#">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
