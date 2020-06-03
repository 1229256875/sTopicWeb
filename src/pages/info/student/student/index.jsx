import React, { useState, useEffect, } from "react";
import {
  Button, Divider, Popconfirm, Spin, Table, Tooltip, Row,
  Col,
  Select,
  Input,
  Cascader,

} from "antd";
import { connect } from "dva";


const Tables = ({ dispatch }) => {

  const [data, setData] = useState([]);

  const [searchView, setSelectView] = useState()

  const { Search } = Input;

  const [serachText, setSerachText] = useState('请输入搜索内容')

  const [cascader, setCascader] = useState()

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id"
    // },
    {
      title: "学号",
      dataIndex: "code",
      // render: text => <a>{text}</a>,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "院系",
      dataIndex: "facultyName",
      render: (text, record) => {
        return <Tooltip title={record.className}>
          <span>{record.facultyName}</span>
        </Tooltip>
      }
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "qq",
      dataIndex: "qq",
    },
    {
      title: '学年',
      dataIndex: 'year',
    },
    {
      title: "个人信息",
      dataIndex: "info",
    },

    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button onClick={setVisible}>
              发消息
            </Button>
          </div>
        );
      }
    }
  ];

  const setVisible = (val = true) => {
    dispatch({
      type: "global/changeNoticesModal",
      payload: {
        visible: val
      }
    });
  };

  useEffect(() => {
    getData()
    getSelectView()
    getCascader()
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

  const getData = payload => {

    const var1 = {
      ...payload,
      type: 2
    }
    if (dispatch) {
      dispatch({
        type: 'manage/getPersonList',
        payload: var1
      }).then((rst) => {
        console.log(rst);
        setData(rst)
      })
    }
  };


  const selectOnChang = e => {
    getSelectView(e)
  }

  const getSelectView = (e = 'code') => {
    const view = []

    view.push(<Search
      allowClear
      placeholder={serachText}
      onSearch={info => onSumber(info, e)}
      style={{ width: '40%' }}
    />)

    switch (e) {
      case 'code':
      case 'name':
      case 'year': setSelectView(view); break
      case 'faculty': setSelectView(getClassList(view)); break
      case 'class': getFacultyList(); break
    }
  }

  const getFacultyList = () => {
    const sing = []
    sing.push(<Cascader
      style={{
        width: '40%',
        textAlign: 'left'
      }}
      placeholder="请选择班级"
      onChange={sing => onSumber(sing, 'class')}
      options={cascader} />
    )
    setSelectView(sing)
  }

  const getClassList = () => {

    return <Select
      style={{ width: '40%' }}
      placeholder="请选择专业"
      optionFilterProp="children"
      onChange={sing => onSumber(sing, 'faculty')}
      options={cascader}
    />

  }


  const onSumber = (e, sing) => {
    console.log('qwe', e)
    const value = {
      code: sing === 'code' ? e : null,
      name: sing === 'name' ? e : null,
      facultyId: sing === 'faculty' ? e : null,
      classId: sing === 'class' ? e[1] : null,
      year: sing === 'year' ? e : null,
    }

    getData(value)
  }





  return (
    <div>
      <Row>
        <Col span='16'>
          <Select defaultValue="学号" onChange={selectOnChang}>
            <Option value="code">学号</Option>
            <Option value="name">姓名</Option>
            <Option value="faculty">专业</Option>
            <Option value="class">班级</Option>
            <Option value="year">学年</Option>
          </Select>
          {searchView}
        </Col>


      </Row>
      <Divider />
      <Table
        columns={columns}
        dataSource={data}
        rowKey={'id'}
      />
    </div>
  );
}

export default connect()(Tables)
