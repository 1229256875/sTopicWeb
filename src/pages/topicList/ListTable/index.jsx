import React, {useEffect, useState} from 'react';

import {Table, Divider, Button, message, Input} from 'antd';

import {connect} from "dva";


const TimeTable = ({dispatch}) => {

  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '课题名称',
      dataIndex: 'topicName',
      key: 'topicName',
      // render: text => <a>{text}</a>,
    },
    {
      title: '课题类型',
      dataIndex: 'mode',
      key: 'mode',
      render: mode => {
        let state = "";
        if (mode === 1) {
          state = '应用型';
        } else if (mode === 2) {
          state = '理论型';
        }
        return (
          <div>
            {state}
          </div>
        );
      },
    },
    {
      title: '面向学年',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '院系名称',
      dataIndex: 'facultyName',
      key: 'facultyName',
    },
    {
      title: '课程信息',
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: '审核状态',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '操作',
      key: 'tags',
      render: (text, record) => {
        return (
          <span>
            <a>hhh</a>
          </span>
        )
      },
    },
  ];


  const getData = () => {
    dispatch({
      type: 'topic/getTopicList',
      payload: {
        type: 1,
      }
    }).then((rst) => {
      setTimeData(rst)
    })
  };

  useEffect(() => {
    getData()
  }, []);

  return (
    <div>
      <Divider/>
      <Table
        columns={columns}
        dataSource={timeData}
        // rowKey={count}
      />
    </div>
  )
};

export default connect()(TimeTable);
