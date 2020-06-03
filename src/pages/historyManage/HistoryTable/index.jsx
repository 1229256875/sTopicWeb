import React, { useEffect, useState } from "react";

import {
  Table, Divider, Button, message, Input, Row, Tooltip, Col,
  Popconfirm,
  Select,
  Cascader,

} from "antd";

import { connect } from "dva";
import { getAuthority } from '@/utils/authority'

const TimeTable = ({ dispatch }) => {

  const [timeData, setTimeData] = useState([]);
  //表头复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [buttonDle, setButtonDle] = useState()

  const [searchView, setSelectView] = useState()

  const [serachText, setSerachText] = useState('请输入搜索内容')

  const [cascader, setCascader] = useState()

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


  const getData = (value) => {
    dispatch({
      type: "topic/getHistoryTopic",
      payload: value,
    }).then(rst => {
      if (rst && rst !== null) {
        rst.map((item) => {
          item.key = item.id
        })
        setTimeData(rst);
      }
    });
  };

  useEffect(() => {
    getCascader()
    getSelectView()
    getData();
  }, []);

  const getCascader = () => {
    if (dispatch) {
      dispatch({
        type: 'faculty/getCascader',
      }).then(rst => {
        setCascader(rst)
      })
    }
  }

  //获取删除按钮
  const getButton = (ids) => {
    const authority = getAuthority()[0]
    const buttonDle = []
    if (authority === 'admin') {
      buttonDle.push(
        <Popconfirm
          title={"Are you sure? "}
          okText={"Yes"}
          onConfirm={() => {
            delPerson(ids)
          }}
          cancelText={"No"}
        >
          <Button danger type='primary'>删除</Button>
        </Popconfirm>
      )
    }
    setButtonDle(buttonDle)
  }


  //删除用户
  const delPerson = (ids) => {
    console.log('ids', ids)
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/deleteUser',
    //     payload: info,
    //   }).then(rst => {
    //     if (rst && rst.status === 200) {
    //       message.success('删除成功')
    //       getData()
    //     } else {
    //       message.error(rst.msg)
    //     }
    //   })
    // }
  }

  const selectOnChang = e => {
    getSelectView(e)
  }


  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
    if (selectedRowKeys.length > 0) {
      getButton(selectedRowKeys)
    } else {
      setButtonDle()
    }
  };

  const getSelectView = (e = 'teacherName') => {
    const view = []
    view.push(<Search
      allowClear
      placeholder={serachText}
      onSearch={info => onSumber(info, e)}
      style={{ width: '40%' }}
    />)

    switch (e) {
      case 'teacherName':
      case 'topicName':
      case 'year': setSelectView(view); break
      case 'mode': setSelectView(getClassList(1)); break
      case 'faculty': setSelectView(getClassList(2)); break
    }

  }

  const classList = [
    {
      value: 2,
      label: '理论型',
    },
    {
      value: 1,
      label: '实践型',
    },
  ]



  const getClassList = (type = 1) => {
    let notte = []
    if (type === 1) {
      notte.push(
        <Select
          style={{ width: '40%' }}
          placeholder={'请选择类型'}
          optionFilterProp="children"
          onChange={sing => onSumber(sing, 'mode')}
          options={classList}
        />
      )
    } else if (type === 2) {
      notte.push(
        <Select
          style={{ width: '40%' }}
          placeholder={'请选择专业'}
          optionFilterProp="children"
          onChange={sing => onSumber(sing, 'faculty')}
          options={cascader}
        />
      )
    }

    return notte
  }




  const onSumber = (e, sing) => {
    console.log('qwe', sing)
    const value = {
      teacherName: sing === 'teacherName' ? e : null,
      topicName: sing === 'topicName' ? e : null,
      year: sing === 'year' ? e : null,
      mode: sing === 'mode' ? e : null,
      facultyId: sing === 'faculty' ? e : null,
    }
    console.log('qwe', value)
    getData(value)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

  };

  const { Search } = Input;

  return (
    <div>
      <Row>
        <Col span='3'>{buttonDle}</Col>
        <Col span="17">

          <Select defaultValue="教师" onChange={selectOnChang}>
            <Option value="teacherName">教师</Option>
            <Option value="topicName">题目</Option>
            <Option value="year">学年</Option>
            <Option value="mode">类型</Option>
            <Option value="faculty">专业</Option>
          </Select>
          {searchView}
        </Col>
        <Col span="4"></Col>

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
