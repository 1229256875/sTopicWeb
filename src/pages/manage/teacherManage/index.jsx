import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect, } from "react";
import { Spin, Table } from "antd";
import styles from "./index.less";
import Tablessss from './teacher'

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  return (
    <PageHeaderWrapper
      content="这是一个新页面，从这里进行开发！"
      className={styles.main}
    >
      <div
        style={{
          paddingTop: 10,
          textAlign: "center"
        }}
      >
        <Tablessss />
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};
