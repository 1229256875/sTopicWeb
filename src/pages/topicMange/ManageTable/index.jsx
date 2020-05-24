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
  Cascader,
  Tooltip,
  Popconfirm,
  Select,

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
  const [faculty, setFaculty] = useState(null);
  const [count, setCount] = useState(0);
  //表单
  const [form] = Form.useForm();

  //表单数据
  const [formData, setFormData] = useState();

  //对话框控件
  const [visible, setVisible] = useState(false);

  const getFaculty = () => {
    if (faculty !== null) {
      return;
    }
    dispatch({
      type: "faculty/getFacultyList"
    }).then(rst => {
      if (rst !== null) {
        setFaculty(rst);
      }
    });
  };

  const confirm = e => {
    dispatch({
      type: "topic/auditTopic",
      payload: {
        id: e,
        type: 0,
      }
    }).then(rst => {
      if (rst && rst.status === 200) {
        message.success('重新审核成功')
        getData()
      } else {
        message.error(rst && rst.msg)
      }
    })
  }

  const onFinish = values => {
    const { facultyIds } = values;
    const value = {
      ...values,
      // facultyId: facultyIds[facultyIds.length - 1],
      id: formData.id,
    };
    dispatch({
      type: "topic/updateTopic",
      payload: value
    }).then(rst => {
      if (rst.status === 200) {
        message.success("修改课题成功!");
        handleCancel();
        getData();
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
      render: (type, record) => {
        let state = "";
        let color = "";
        if (type === 0) {
          state = "未进行审核";
          color = "#1a09ff";
          return <Tag color={color}>{state}</Tag>;
        } else if (type === 1) {
          state = "审核已通过";
          color = "#12dd0f";
          return <Tooltip
            title={record.response}
            placement="bottomLeft"
            visible={false}
          ><Tag color={color}>{state}</Tag>
          </Tooltip>;
        } else if (type === 2) {
          state = "审核未通过";
          color = "red";
          return <Tooltip
            title={record.response}
            placement="bottomLeft"
          >
            <Popconfirm
              title="是否重新申请 ?"
              onConfirm={() => { confirm(record.id) }}
              okText="Yes"
              cancelText="No"
            >
              <Tag color={color}>{state}</Tag>
            </Popconfirm>
          </Tooltip>;
        }
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
                showModal(record);
              }}
            >
              查看
            </Button>
            <Popconfirm
              title='是否要删除题目?'
              onConfirm={() =>{
                deleteTopic(record.id)
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{
                  marginLeft: 20
                }}
                type="primary"
                danger
              >
                删除
            </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const deleteTopic = e => {
    if (e) {
      dispatch({
        type: 'topic/deleteTopic',
        payload: {
          id: e,
        }
      }).then(rst => {
        if (rst.status === 200) {
          message.success('删除成功');
          getData();
        } else {
          message.error(rst && rst.msg)
        }
      })
    }
  }

  const showModal = type => {
    getFaculty();
    setCount(count + 1)
    console.log(type);
    setFormData(type);
    setVisible(true);

  };

  const handleCancel = e => {
    setVisible(false);
  };

  useEffect(() => {
    form.resetFields();
  }, [formData])

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

  const { Option } = Select;

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
          key={count}
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
            name="facultyId"
            rules={[
              {
                required: true,
                message: "请选择面向院系!"
              }
            ]}
          >
            <Select
              style={{ width: '100%' }}
            >
              {faculty && faculty.map(d => (
                <Option
                  key={d.id}
                  value={d.id}
                >
                  {d.facultyName}
                </Option>
              ))}
            </Select>
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
              修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect()(TimeTable);
