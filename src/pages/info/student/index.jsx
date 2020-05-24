import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import styles from "./index.less";
import Tablesss from './student'

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
          // paddingTop: 100,
          textAlign: "center"
        }}
      >
        <Tablesss/>
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};
