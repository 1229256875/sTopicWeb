import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import Sider from "antd/es/layout/Sider";
import { connect } from "dva";
import { withRouter } from 'umi'

import style from '../index.less'

 const Page =  ({ location, data, dispatch }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log('asd', location)
  }, []);

  const { Header, Footer, Content } = Layout;

  return (
    <div>
      <PageHeaderWrapper
      title={'题目详情'}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect()(withRouter(Page));