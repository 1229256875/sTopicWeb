import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Input, Button, message } from "antd";
import { getAuthority } from "@/utils/authority";
import { connect } from "dva";
import { student, teacher, admin } from "./const";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

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
const Page = ({ data, dispatch }) => {
  const [personn, setPersonn] = useState([]);

  useEffect(() => {
    dispatch({
      type: "person/getPersonInfo"
    }).then(rst => {
      setPersonn(rst);
    });
  }, []);

  useEffect(() => {}, [data]);

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

  const authority = getAuthority()?.[0];
  const formList = {
    student,
    teacher,
    admin
  };

  return (
    Object.prototype.toString.call(data) === "[object Object]" &&
    Object.keys(data)?.length > 0 && (
      <Card>
        <Form
          style={{
            marginTop: 50
          }}
          {...layout}
          onFinish={onSubmit}
          initialValues={{ ...data, sex: sexList[data?.sex] }}
        >
          <Row gutter={24}>
            {(formList[authority] || []).map(
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
      </Card>
    )
  );
};

export default connect(({ person }) => ({ data: person.personInfo }))(Page);
