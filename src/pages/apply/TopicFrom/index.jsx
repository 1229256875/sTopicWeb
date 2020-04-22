import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.less";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Select,
  message,
  Cascader
} from "antd";
import { connect } from "dva";

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 12
  }
};

const Demo = props => {
  const [year, setYear] = useState("0000");
  const [faculty, setFaculty] = useState([]);

  const { dispatch } = props;

  const [form] = Form.useForm();
  const { resetFields } = form;

  const onFinish = values => {
    const { facultyId } = values;
    const value = {
      ...values,
      facultyId: facultyId[facultyId.length - 1],
      year: year
    };
    dispatch({
      type: "topic/insertTopic",
      payload: value
    }).then(rst => {
      if (rst.status === 200) {
        message.success("申请课题成功,请耐心等待审批!");
        resetFields();
      } else {
        message.error(rst.msg);
      }
    });
    console.log("Success:", values);
  };

  useEffect(() => {
    dispatch({
      type: "faculty/getFacultyList"
    }).then(rst => {
      if (rst !== null) {
        setFaculty(rst);
      }
    });
  }, []);

  useEffect(() => {}, [faculty]);

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const changeYear = (data, str) => {
    setYear(str);
  };

  const topicNameChange = e => {
    console.log(e);
  };

  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{
        width: 500
      }}
    >
      <Form.Item
        label="课题名称: "
        name="topicName"
        rules={[
          {
            required: true,
            message: "请输入课题名称!"
          }
        ]}
        size={300}
      >
        <Input onChange={topicNameChange} />
      </Form.Item>

      <Form.Item
        label="课题类型: "
        name="mode"
        rules={[
          {
            required: true,
            message: "请选择课题类型!"
          }
        ]}
      >
        <Radio.Group value={2}>
          <Radio.Button value={1}>理论型</Radio.Button>
          <Radio.Button value={2}>实践型</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="面向学年: "
        // name="year"
        rules={[
          {
            required: true,
            message: "请选择面向学年!"
          }
        ]}
      >
        <DatePicker picker="year" onChange={changeYear} />
      </Form.Item>
      <Form.Item
        label="面向院系: "
        name="facultyId"
        rules={[
          {
            type: "array",
            required: true,
            message: "请选择面向院系!"
          }
        ]}
      >
        <Cascader options={faculty} />
      </Form.Item>

      <Form.Item
        label="课题信息: "
        name="info"
        rules={[
          {
            required: true,
            message: "请输入课题信息!"
          }
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect()(Demo);
