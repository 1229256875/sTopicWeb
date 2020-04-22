import React, { useEffect, useState } from "react";

import { Table, Divider, Button, message, Input, Popconfirm } from "antd";

import { connect } from "dva";

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

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "课题名称",
      dataIndex: "topicName",
      key: "topicName"
      // render: text => <a>{text}</a>,
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
            <Button>查看</Button>
            {/*<Button onClick={() => {*/}
            {/*  deleteTopic(text.id)*/}
            {/*}}>*/}
            {/*  删除*/}
            {/*</Button>*/}

            <Popconfirm
              title={"Are you sure? "}
              okText={"Yes"}
              onConfirm={() => {
                deleteTopic(text.id);
              }}
              cancelText={"No"}
            >
              <Button>删除</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

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
      } else {
        message.error(rst.msg);
      }
    });
  };

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

  useEffect(() => {}, [topicData]);

  return (
    <div>
      <Divider />
      <Table
        columns={columns}
        dataSource={topicData}
        // rowKey={count}
      />
    </div>
  );
};

export default connect()(TimeTable);
