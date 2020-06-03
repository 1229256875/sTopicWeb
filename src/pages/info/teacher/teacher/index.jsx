import React, { useState, useEffect, } from "react";
import {
  Button, Divider, Popconfirm, Spin, Table,
  Row,
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


  const columns = [

    {
      title: "编号",
      dataIndex: "code",
      // render: text => <a>{text}</a>,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "院系",
      dataIndex: "collegeName",
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
    getSelectView()
    getData()
  }, []);


  const selectOnChang = e => {
    getSelectView(e)
  }

  const onSumber = (e, sing) => {
    const value = {
      code: sing === 'code' ? e : null,
      name: sing === 'name' ? e : null,
    }

    getData(value)
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
    }
  }

  const getData = payload => {
    const value = {
      ...payload,
      type: 1,
    }
    if (dispatch) {
      dispatch({
        type: 'manage/getPersonList',
        payload: value
      }).then((rst) => {
        setData(rst)
      })
    }
  };


  return (
    <div>
      <Row>


        <Col span='16'>
          <Select defaultValue="编号" onChange={selectOnChang}>
            <Option value="code">编号</Option>
            <Option value="name">姓名</Option>
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
