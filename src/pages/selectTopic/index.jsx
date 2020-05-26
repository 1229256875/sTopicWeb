import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import styles from "./index.less";
import ListTopic from "./ListTable";

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <PageHeaderWrapper
      className={styles.main}
    >
      <div
        style={{
          textAlign: "center"
        }}
      >
        <ListTopic />
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};
