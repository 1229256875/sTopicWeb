import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import styles from "./index.less";
import ListTable from "./ListTable";


/**
 * 对管理员来说,这个选题
 */
export default () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <PageHeaderWrapper
      className={styles.main}
    >
      <div
        style={{
          // paddingTop: 10,
          textAlign: "center"
        }}
      >
        <Spin spinning={loading} size="large" />
        <ListTable />
        
      </div>
    </PageHeaderWrapper>
  );
};
