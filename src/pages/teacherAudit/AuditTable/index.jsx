import React, { useEffect, useState } from "react";

import {
  Table,
  Divider,
  Radio,
  Button,
  message,
  Modal,
  Spin,
  Input
} from "antd";

import { connect } from "dva";

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

const TimeTable = ({ dispatch }) => {
  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //返回值
  const [response, setResponse] = useState("");

  //所处类型 0：未审核 1：已通过 2：已拒绝
  const [status, setStatus] = useState(0);

  const columns = [
    {
      title: "课题名称",
      dataIndex: "topicName",
      key: "topicName"
      // render: text => <a>{text}</a>,
    },
    {
      title: "学生姓名",
      dataIndex: "studentName",
      key: "studentName"
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
      title: "学生专业",
      dataIndex: "className",
      key: "className"
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
                showHand();
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
          </span>
        );
      }
    }
  ];

  const { TextArea } = Input;

  const handleCancel = () => {
    setVisible(false);
  };

  const showHand = () => {
    setVisible(true);
  };

  const auditTopic = (id, type, var0) => {
    console.log(dispatch);
    dispatch({
      type: "select/teacherAudit",
      payload: {
        status: type,
        id: id,
        teaReaso: var0
      }
    }).then(rst => {
      console.log("asd", rst);
      if (rst.status === 200) {
        message.success("审核成功");
      } else {
        message.error(rst.data);
      }
    });
  };

  const getData = type => {
    dispatch({
      type: "select/searchTopic",
      payload: {
        status: type
      }
    }).then(da => {
      console.log("da", da);
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
        }}
        value={type}
      >
        <Radio value={0}>未审核</Radio>
        <Radio value={1}>审核已通过</Radio>
        <Radio value={2}>已拒绝</Radio>
      </Radio.Group>

      <Divider />
      <Table columns={columns} dataSource={timeData} rowKey={count} />
    </div>
  );
};

export default connect()(TimeTable);