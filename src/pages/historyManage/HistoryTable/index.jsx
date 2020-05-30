import React, { useEffect, useState } from "react";

import { Table, Divider, Button, message, Input, Row, Tooltip, Col, } from "antd";

import { connect } from "dva";
import { getAuthority } from '@/utils/authority'

const TimeTable = ({ dispatch }) => {

  const [timeData, setTimeData] = useState([]);
  //表头复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [buttonDle, setButtonDle] = useState()

  const columns = [
    {
      title: "课题名称",
      dataIndex: "topicName",
      render: info => {
        let tee = info;
        if (tee && tee.length > 7) {
          tee = tee.substring(0, 7) + '...';
        }
        return (
          <Tooltip title={info}>
            <span>{tee}</span>
          </Tooltip>
        );
      }
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
      render: mode => {
        let state = "";
        if (mode === 1) {
          state = "实践型";
        } else if (mode === 2) {
          state = "理论型";
        }
        return <div>{state}</div>;
      }
    },
    {
      title: "面向学年",
      dataIndex: "year",
      key: "year",
      sorter: {
        compare: (a, b) => a.year - b.year,
        multiple: 2
      }
    },
    {
      title: "院系名称",
      dataIndex: "facultyName",
      key: "facultyName"
    },
    {
      title: "课程信息",
      dataIndex: "info",
      key: "info",
      render: info => {
        let tee = info;
        if (tee && tee.length > 6) {
          tee = tee.substring(0, 6) + '...';
        }
        return (
          <Tooltip title={info}>
            <span>{tee}</span>
          </Tooltip>
        );
      }
    },
  ];


  const getData = () => {
    dispatch({
      type: "topic/getHistoryTopic"
    }).then(rst => {
      rst.map((item) => {
        item.key = item.id
      })
      setTimeData(rst);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  //获取删除按钮
  const getButton = () => {
    const authority = getAuthority()[0]
    const buttonDle = []
    if (authority === 'admin') {
      buttonDle.push(<Button danger type='primary'> 删除</Button>)
    }
    setButtonDle(buttonDle)
  }


  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
    if (selectedRowKeys.length > 0){
      getButton()
    }else{
      setButtonDle()
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

  };

  const { Search } = Input;

  return (
    <div>
      <Row>
        <Col span="8">
          <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        </Col>
        <Col span="8"></Col>
        <Col span='8'>{buttonDle}</Col>
      </Row>
      <Divider />
      <Table
        columns={columns}
        dataSource={timeData}
        rowSelection={rowSelection}
        rowKey={'id'}
      />

    </div>
  );
};

export default connect()(TimeTable);
