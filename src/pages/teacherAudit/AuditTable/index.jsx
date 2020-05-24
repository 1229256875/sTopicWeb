import React, { useEffect, useState } from "react";

import {
  Table,
  Divider,
  Radio,
  Button,
  message,
  Modal,
  Spin,
  Input,
  Tooltip,
} from "antd";

import { connect } from "dva";
import { Link } from 'umi'


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
  const [type, setType] = useState(1);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //操作头标题
  const [infoText, setInfoText] = useState('操作')

  //返回值
  const [response, setResponse] = useState("");

  //所处类型 0：未审核 1：已通过 2：已拒绝
  const [status, setStatus] = useState(0);

  const columns = [
    {
      title: "课题名称",
      dataIndex: "topicName",
      // render: text => <a>{text}</a>,
    },
    {
      title: "学生姓名",
      dataIndex: "studentName",
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
      title: "学生专业",
      dataIndex: "className",
      render: (text, record) => {
        let { className, facultyName } = record
        return <Tooltip title={className}>
          {facultyName}
        </Tooltip>
      }
    },
    {
      title: "课程信息",
      dataIndex: "info",
      render: (text, record) => {
        const { info } = record
        let rstt = info;
        if (info && info.length > 6) {
          rstt = rstt.substring(0, 6) + '...'
        }
        return <Tooltip title={info}>
          <span>{rstt}</span>
        </Tooltip>
      }
    },
    {
      title: `${infoText}`,
      key: "tags",
      render: (text, record) => {
        const { status } = record

        if (status === 1) {
          return <div><Button
            type={'primary'}
          >
            <Link to={{ pathname: "/teacherAudit/topicInfo", state: { record } }}>查看</Link >
          </Button>
          </div>
        }
        if (status === 2) {
          const { teaReaso } = record
          let rstt = teaReaso;
          if (teaReaso && teaReaso.length > 6) {
            rstt = rstt.substring(0, 6) + '...'
          }
          return <Tooltip title={teaReaso}>
            <span>{rstt}</span>
          </Tooltip>
        }

        if (status === 0) {
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
                footer={[
                  <Button
                    onClick={() => {
                      auditTopic(text.id, 2, response);
                      handleCancel();
                    }}
                    danger
                    type="primary"
                  >
                    拒绝
              </Button>,
                  <Button
                    onClick={() => {
                      auditTopic(text.id, 1, response);
                      handleCancel();
                    }}
                    type="primary"
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
    }
  ];

  const { TextArea } = Input;

  const handleCancel = () => {
    setVisible(false);
  };

  const showHand = () => {
    setVisible(true);
  };

  const auditTopic = (id, type1, var0) => {
    dispatch({
      type: "select/teacherAudit",
      payload: {
        status: type1,
        id: id,
        teaReaso: var0
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
    if (type === 0) {
      setInfoText('审核');
    }
    if (type === 1) {
      setInfoText('操作')
    }
    if (type === 2) {
      setInfoText('拒绝信息')
    }
    dispatch({
      type: "select/searchTopic",
      payload: {
        status: type
      }
    }).then(da => {
      setTimeData(da);
    });
  };

  useEffect(() => {
    getData(type);
  }, []);

  return (
    <div>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setType(value);
          getData(value);
        }}
        value={type}
        buttonStyle="solid"
      >
        <Radio.Button value={1}>审核已通过</Radio.Button>
        <Radio.Button value={0}>未进行审核</Radio.Button>
        <Radio.Button value={2}>审核已拒绝</Radio.Button>
      </Radio.Group>

      <Divider />
      <Table columns={columns} dataSource={timeData} rowKey={'id'} />
    </div>
  );
};

export default connect()(TimeTable);
