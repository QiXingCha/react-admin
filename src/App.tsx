import { BrowserRouter } from "react-router";
import { ConfigProvider, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import RouterContainer from "./routes";
import useOEM from "./hooks/useOem";
import { getRouterBasename, mergeConfig } from "./utils/oem";
import "./styles/global.css";

function App() {
  const _config = useOEM();
  const config = mergeConfig(_config);
  const basename = getRouterBasename();

  return (
    <ConfigProvider locale={zhCN} theme={config}>
      <AntApp>
        <BrowserRouter basename={basename} key={basename ?? "__root__"}>
          <RouterContainer />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
