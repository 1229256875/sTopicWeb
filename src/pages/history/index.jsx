import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import styles from "./index.less";
import History from "./HistoryTable";

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
        <History />
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};
