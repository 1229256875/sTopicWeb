import React, { useEffect } from "react";
import { Form, Card, Row, Col, Input, Button } from "antd";
import { getAuthority } from "@/utils/authority";
import { connect } from "dva";
import { student, teacher, admin } from "./const";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const Page = ({ data, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: "person/getPersonInfo"
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onSubmit = values => {
    console.log(values);
  };

  const authority = getAuthority()?.[0];
  const formList = {
    student,
    teacher,
    admin
  };

  return (
    <Card>
      <Form {...layout} onFinish={onSubmit}>
        <Row gutter={24}>
          {(formList[authority] || []).map(({ label, name }) => (
            <Col span={12} key={name}>
              <Form.Item
                name={name}
                label={label}
                rules={[{ required: true, message: `请填写${label}` }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item wrapperCol={{ span: 10, offset: 2 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default connect(({ person }) => ({ data: person.personInfo }))(Page);
