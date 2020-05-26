import React, { useEffect, useState } from "react";
import { CheckOutlined } from '@ant-design/icons';
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
  Cascader,
  Tooltip
} from "antd";

import { connect } from "dva";

//button显示按钮文字
const statusList = {
  0: "审核",
  1: "删除",
  2: "删除"
};
//mode 显示内容
const typeList = {
  1: "理论型",
  2: "实践型"
  // default: '未知'
};

const TimeTable = ({ dispatch }) => {
  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);
  const [visible, setVisible] = useState(false);
  //查看 Modal 显示按钮
  const [wiveVisible, setWiveVisible] = useState(false);
  const [dager, setDager] = useState(false);

  const [loading, setLoading] = useState(false);

  const [deleteText, setDeleteText] = useState('')

  const [deleteId, setDeleteId] = useState(0)

  //返回值
  const [response, setResponse] = useState("");

  //所处类型 0：未审核 1：已通过 2：已拒绝
  const [status, setStatus] = useState(0);

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
      render: (text, record) => {
        let info = text;
        if (text && text.length > 6) {
          info = info.substring(0, 6) + '...';
        }
        return <Tooltip title={text}>
          {info}
        </Tooltip>
      }
    },
    {
      title: "教师",
      dataIndex: "teacherName",
    },
    {
      title: "课题类型",
      dataIndex: "mode",
      render: text => {
        let rst = typeList[text] || "未知";

        return <div>{rst}</div>;
      }
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
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <span>
            <Button
              type={"primary"}
              danger={dager}
              onClick={() => {
                showHand(record)
              }}
            >
              {statusList[type]}
            </Button>
            <Modal
              title="审核题目"
              visible={visible}
              confirmLoading={false}
              onCancel={handleCancel}
              footer={[ 
                <Button
                onClick={() => {
                  auditTopic(text.id, 2, response);
                  handleCancel();
                }}
                type='primary'
                danger
              >
                拒绝
              </Button>,
              
              <Button
                onClick={() => {
                  auditTopic(text.id, 1, response);
                  handleCancel();
                }}
                color='#092b00'
                type='primary'
                style={{
                }}
              >
                通过
              </Button>,
              
              ]}
            >
              <TextArea
                placeholder="请输入审核理由"
                rows={3}
                onChange={e => {
                  setResponse(e.target.value);
                }}
              />
              
             
            </Modal>
          </span>
        );
      }
    }
  ];

  const { TextArea } = Input;

  const handleCancel = () => {
    setVisible(false);
    setWiveVisible(false);
  };

  const showHand = (text) => {
    const { topicName, type, id } = text;
    //未审核
    if (type === 0) {
      setVisible(true)
    } else {
      setDeleteId(id);
      setDeleteText(topicName);
      setWiveVisible(true);
    }

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

  const deleteTopic = id => {
    console.log("删除id ", id);
    dispatch({
      type: "topic/deleteTopic",
      payload: {
        id: id
      }
    }).then(rst => {
      console.log(rst);
      if (rst.status === 200) {
        message.success("删除成功");
        getData();
        setWiveVisible(false)
      } else {
        message.error(rst.msg);
      }
    });
    // setWiveVisible(false)
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
        onChange={({ target: { value } }) => {
          setType(value);
          getData(value);
          if (value && value !== 0) {
            setDager(true)
          } else {
            setDager(false)
          }
        }}
        value={type}
        buttonStyle="solid"
      >
        <Radio.Button value={0}>未审核</Radio.Button>
        <Radio.Button value={1}>审核已通过</Radio.Button>
        <Radio.Button value={2}>已拒绝</Radio.Button>
      </Radio.Group>

      <Divider />
      <Table columns={columns} dataSource={timeData} rowKey={'id'} />
      <Modal
        title="删除题目"
        visible={wiveVisible}
        confirmLoading={false}
        onCancel={handleCancel}
        onOk={() => { deleteTopic(deleteId) }}
      >
        确认删除题目: {deleteText}
      </Modal>
    </div>
  );
};

export default connect()(TimeTable);
