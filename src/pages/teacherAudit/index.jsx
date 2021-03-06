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
    }, 1500);
  }, []);

  const { Header, Footer, Content } = Layout;

  return (
    <div>
      <PageHeaderWrapper
        className={styles.main}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          <AudittTable />
        </div>
      </PageHeaderWrapper>
    </div>
  );
};
