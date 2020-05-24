import React, { useEffect, useState } from "react";

import { Table, Divider, Button, message, Input, Popconfirm, Tooltip, Modal, Form, Radio } from "antd";

import { connect } from "dva";

import { getAuthority } from "@/utils/authority";

//mode 显示内容
const typeList = {
  1: "理论型",
  2: "实践型"
  // default: '未知'
};

const auditList = {
  0: "未审核",
  1: "已通过",
  2: "未通过"
};

const TimeTable = ({ dispatch }) => {
  const [topicData, setTopicData] = useState([]);
  const [count, setCount] = useState(0);

  //查看 Modal 显示按钮
  const [wiveVisible, setWiveVisible] = useState(false);

  const [formData, setFormData] = useState({});



  const [form] = Form.useForm();

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

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id"
    // },
    {
      title: "课题名称",
      dataIndex: "topicName",
      // render: text => <a>{text}</a>,
    },
    {
      title: "课题类型",
      dataIndex: "mode",
      render: mode => {
        let state = typeList[mode] || "未知";
        return <div>{state}</div>;
      }
    },
    {
      title: '教师姓名',
      dataIndex: 'teacherName',
    },
    {
      title: "面向学年",
      dataIndex: "year",
    },
    {
      title: "院系名称",
      dataIndex: "facultyName",
    },
    {
      title: "课程信息",
      dataIndex: "info",
      render: (text, record) => {
        let info = text;
        if (text && text.length > 8) {
          info = info.substring(0, 8) + '...';
        }
        return <Tooltip title={text}>
          {info}
        </Tooltip>
      }
    },
    {
      title: "审核状态",
      dataIndex: "type",
      render: type => {
        let text = auditList[type] || "未知";
        return <span>{text}</span>;
      }
    },
    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button onClick={() => {
              setFormData(text);
              setWiveVisible(true);
            }}>查看</Button>
          </div>
        );
      }
    }
  ];

  //清除form表单中的值
  useEffect(() => {
    form.resetFields();
  }, [formData])

  const getData = () => {
    dispatch({
      type: "topic/getTopicList",
      payload: {
        type: 1
      }
    }).then(rst => {
      setTopicData(rst);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCancel = () => {
    // setVisible(false);
    setWiveVisible(false);
  };

  const onFinish = () => {

  }


  const onFinishFailed = () => {

  }

  useEffect(() => { }, [topicData]);

  return (
    <div>
      <Divider />
      <Table
        columns={columns}
        dataSource={topicData}
        rowKey={'id'}
      />

      <Modal title="查看"
        visible={wiveVisible}
        confirmLoading={false}
        onCancel={handleCancel}
        footer={null}>

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
            name="facultyName"
            rules={[
              {
                message: "请选择面向院系!"
              }
            ]}
          >
            <Input disabled />
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
