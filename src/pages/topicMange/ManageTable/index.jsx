import React, { useEffect, useState } from "react";

import {
  Table,
  Divider,
  Button,
  message,
  Input,
  Tag,
  Modal,
  Form,
  Radio,
  DatePicker,
  Cascader
} from "antd";

import { connect } from "dva";

const auditList = {
  未进行审核: 0,
  审核已通过: 1,
  审核未通过: 2
};

//mode 显示内容
const typeList = {
  1: "理论型",
  2: "实践型"
  // default: '未知'
};

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

const TimeTable = ({ dispatch }) => {
  const [timeData, setTimeData] = useState([]);
  //院校信息
  const [faculty, setFaculty] = useState();
  const [count, setCount] = useState(0);
  //表单
  const [form] = Form.useForm();

  //表单数据
  const [formData, setFormData] = useState();

  //对话框控件
  const [visible, setVisible] = useState(false);

  const getFaculty = () => {
    dispatch({
      type: "faculty/getFacultyList"
    }).then(rst => {
      if (rst !== null) {
        setFaculty(rst);
      }
    });
  };

  const onFinish = values => {
    const { facultyIds } = values;
    const value = {
      ...values,
      facultyId: facultyIds[facultyIds.length - 1]
    };
    dispatch({
      type: "topic/insertTopic",
      payload: value
    }).then(rst => {
      if (rst.status === 200) {
        message.success("修改课题成功,请耐心等待审批!");
      } else {
        message.error(rst.msg);
      }
    });
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "课题名称",
      dataIndex: "topicName",
      key: "topicName"
    },
    {
      title: "课题类型",
      dataIndex: "mode",
      key: "mode",
      render: mode => {
        let state = typeList[mode] || "未知";
        return <div>{state}</div>;
      }
    },
    {
      title: "面向学年",
      dataIndex: "year",
      key: "year"
    },
    {
      title: "院系名称",
      dataIndex: "facultyName",
      key: "facultyName"
    },
    {
      title: "课程信息",
      dataIndex: "info",
      key: "info"
    },
    {
      title: "审核状态",
      dataIndex: "type",
      key: "type",
      render: type => {
        let state = "";
        let color = "";
        if (type === 0) {
          state = "未进行审核";
          color = "#1a09ff";
        } else if (type === 1) {
          state = "审核已通过";
          color = "#12dd0f";
        } else if (type === 2) {
          state = "审核未通过";
          color = "red";
        }
        return <Tag color={color}>{state}</Tag>;
      }
    },
    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                showModal(text);
              }}
            >
              查看
            </Button>
            <Button
              style={{
                marginLeft: 20
              }}
            >
              删除
            </Button>
          </div>
        );
      }
    }
  ];

  const showModal = type => {
    getFaculty();
    console.log(type);
    setFormData(type);
    setVisible(true);
  };

  const handleOk = e => {
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const getData = () => {
    dispatch({
      type: "topic/getTopicList",
      payload: {}
    }).then(rst => {
      setTimeData(rst);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Divider />
      <Table
        columns={columns}
        dataSource={timeData}
        // rowKey={count}
      />
      <Modal
        title="题目详情"
        visible={visible}
        footer={false}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={formData}
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
            <Input />
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
            <Radio.Group>
              <Radio.Button value={1}>理论型</Radio.Button>
              <Radio.Button value={2}>实践型</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="面向院系: "
            name="facultyIds"
            rules={[
              {
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
            <Button type="primary" htmlType="修改">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect()(TimeTable);
