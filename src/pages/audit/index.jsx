import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import styles from "./index.less";
import AudittTable from "./AuditTable";
import Sider from "antd/es/layout/Sider";

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const { Header, Footer, Content } = Layout;

  return (
    <div>
      <PageHeaderWrapper
        // content="这是一个新页面，从这里进行开发！"
        className={styles.main}
      >
        <div
          style={{
            paddingTop: 10,
            textAlign: "center"
          }}
        >
          <AudittTable />
          <Spin spinning={loading} size="large" />
        </div>
      </PageHeaderWrapper>
    </div>
  );
};
