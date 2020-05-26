import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import styles from "./index.less";
import Servlet from "./servlet";

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <PageHeaderWrapper
      className={styles.main}
    >
      <div
        style={{
          paddingTop: 10,
          textAlign: "center"
        }}
      >
        <Servlet />
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};
