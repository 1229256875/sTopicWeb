import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Input, Button, message } from "antd";
import { getAuthority } from "@/utils/authority";
import { connect } from "dva";
import { student, teacher, admin } from "./const";
import styles from "./index.less";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { withRouter } from 'umi'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const sexList = {
  1: "男",
  2: "女",
  0: "不男不女"
};
const sexSet = {
  男: 1,
  女: 2
};
const Page = ({ location, data, dispatch }) => {
  const [personn, setPersonn] = useState([]);

  const { state } = location;
  const { record } = state;




  useEffect(() => {
    setPersonn(record)
  }, []);

  useEffect(() => { }, [data]);

  const changInfo = values => {
    dispatch({
      type: "person/updateUser",
      payload: values
    }).then(rst => {
      if (rst?.status === 200) {
        message.success("修改成功");
      } else {
        message.error(rst.msg);
      }
    });
  };

  const onSubmit = values => {
    values.id = personn.id;
    values.type = personn.type;
    values = {
      ...values,
      sex: sexSet[values?.sex]
    };
    changInfo(values);
    console.log(values);
  };
  
  // 获取角色等级
  // const authority = getAuthority()?.[0];
  const formList = {
    2: student,
    1: teacher,
    0: admin
  };

  return (

    Object.prototype.toString.call(personn) === "[object Object]" &&
    Object.keys(personn)?.length > 0 && (
      <PageHeaderWrapper
        title={'用户信息'}
        className={styles.main}
      >
        <Form
          style={{
            marginTop: 30
          }}
          {...layout}
          onFinish={onSubmit}
          initialValues={{ ...personn, sex: sexList[personn?.sex] }}
        >
          <Row gutter={24}>
            {(formList[personn.type] || []).map(
              ({ label, name, disabled = false }) => (
                <Col span={12} key={name}>
                  <Form.Item
                    name={name}
                    label={label}
                    rules={[{ required: true, message: `请填写${label}` }]}
                  >
                    <Input disabled={disabled} />
                  </Form.Item>
                </Col>
              )
            )}
            <Col span={24}>
              <Form.Item wrapperCol={{ span: 10, offset: 2 }}>
                <Button type="primary" htmlType="submit">
                  修改
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </PageHeaderWrapper>
    )
  );
};

export default connect(({ person }) => ({ data: person.personInfo }))(withRouter(Page));

// export default () => {
//   return <div>New Page</div>;
// };