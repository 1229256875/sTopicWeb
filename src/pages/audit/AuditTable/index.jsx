import React, {useEffect, useState} from "react";

import {
  Table,
  Form,
  Divider,
  Radio,
  Button,
  message,
  Modal,
  Spin,
  Input,
  DatePicker,
  Cascader
} from "antd";

import {connect} from "dva";

//button显示按钮文字
const statusList = {
  0: "审核",
  1: "查看",
  2: "查看"
};
//mode 显示内容
const typeList = {
  1: "理论型",
  2: "实践型"
  // default: '未知'
};

const TimeTable = ({dispatch}) => {
  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);
  const [visible, setVisible] = useState(false);
  //查看 Modal 显示按钮
  const [wiveVisible, setWiveVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  //返回值
  const [response, setResponse] = useState("");

  //所处类型 0：未审核 1：已通过 2：已拒绝
  const [status, setStatus] = useState(0);

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
    //   title: 'Id',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: "课题名称",
      dataIndex: "topicName",
      key: "topicName"
      // render: text => <a>{text}</a>,
    },
    {
      title: "教师",
      dataIndex: "teacherName",
      key: "${id}"
    },
    {
      title: "课题类型",
      dataIndex: "mode",
      key: "mode",
      render: text => {
        let rst = typeList[text] || "未知";

        return <div>{rst}</div>;
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
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <span>
            <Button
              type={"primary"}
              onClick={() => {
                showHand(text);
              }}
            >
              {statusList[type]}
            </Button>
            <Modal
              title="审核"
              visible={visible}
              confirmLoading={false}
              onCancel={handleCancel}
              footer={null}
            >
              <TextArea
                placeholder="请输入审核理由"
                rows={3}
                onChange={e => {
                  setResponse(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  auditTopic(text.id, 1, response);
                  handleCancel();
                }}
              >
                通过
              </button>
              <button
                onClick={() => {
                  auditTopic(text.id, 2, response);
                  handleCancel();
                }}
              >
                拒绝
              </button>
            </Modal>

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
            <Input/>
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
            {/*<Cascader options={faculty} />*/}
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
            <Input.TextArea/>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="修改">
              提交
            </Button>
          </Form.Item>
        </Form>
            </Modal>
          </span>
        );
      }
    }
  ];

  const {TextArea} = Input;

  const onFinish = () => {

  }

  useEffect(() =>{
    form.resetFields();
  }, [formData])


  const onFinishFailed = () => {

  }

  const handleCancel = () => {
    setVisible(false);
    setWiveVisible(false);
  };

  const showHand = (text) => {
    const {type} = text;
    //未审核
    if (type === 0) {
      setVisible(true)
    } else if (type === 1) { //审核通过 只能查看
      // const {FormInstance} = form;
      setFormData(text);
      setWiveVisible(true);
    } else if (type === 2) {// 审核未通过,理论 教师可以重新申请一次
      setFormData(text);
      setWiveVisible(true);
    }
    setVisible(true);
  };

  const auditTopic = (id, var1, var0) => {
    dispatch({
      type: "topic/auditTopic",
      payload: {
        type: var1,
        id: id,
        response: var0
      }
    }).then(rst => {
      console.log("asd", rst);
      if (rst.status === 200) {
        message.success("审核成功");
        getData(type)
      } else {
        message.error(rst.data);
      }
    });
  };

  const getData = type => {
    dispatch({
      type: "topic/getTopicList",
      payload: {
        type: type
      }
    }).then(da => {
      setTimeData(da);
    });
  };

  useEffect(() => {
    getData(0);
  }, []);

  return (
    <div>
      <Radio.Group
        onChange={({target: {value}}) => {
          setType(value);
          getData(value);
        }}
        value={type}
      >
        <Radio value={0}>未审核</Radio>
        <Radio value={1}>审核已通过</Radio>
        <Radio value={2}>已拒绝</Radio>
      </Radio.Group>

      <Divider/>
      <Table columns={columns} dataSource={timeData} rowKey={'id'}/>
    </div>
  );
};

export default connect()(TimeTable);
