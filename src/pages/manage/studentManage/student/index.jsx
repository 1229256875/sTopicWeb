import React, { useState, useEffect, } from "react";
import { Button, Divider, Popconfirm, Spin, Table, Tooltip, Form, Row, Col } from "antd";
import { connect } from "dva";
import { Link } from 'umi'
import { getAuthority } from '@/utils/authority'


const Tables = ({ dispatch }) => {

  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({})

  const [form] = Form.useForm();

  //表头复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const [buttonDle, setButtonDle] = useState()

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
      render: (text, record) => {
        let info = text;
        if (info && info.length > 6) {
          info = info.substring(0, 6) + '...';
        }
        return <Tooltip title={text}>
          <span>{info}</span>
        </Tooltip>

      }
    },

    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button type={'primary'}>
              <Link to={{ pathname: "/manage/personInfo", state: { record } }}>查看</Link >
            </Button>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    const var1 = {
      type: 2
    }
    getData(var1)
  }, []);

  //清除form表单中的值
  useEffect(() => {
    form.resetFields();
  }, [formData])


  const getData = payload => {
    if (dispatch) {
      dispatch({
        type: 'manage/getPersonList',
        payload: payload
      }).then((rst) => {
        console.log(rst);
        setData(rst)
      })
    }
  };

  //获取删除按钮
  const getButton = () => {
    const authority = getAuthority()[0]
    const buttonDle = []
    if (authority === 'admin') {
     
      buttonDle.push( <Popconfirm
        title={"Are you sure? "}
        okText={"Yes"}
        onConfirm={() => {
          // deleteTopic(text.id);
        }}
        cancelText={"No"}
      >
        <Button danger type='primary'>删除</Button>
      </Popconfirm>)
    }
    setButtonDle(buttonDle)
  }

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
    if (selectedRowKeys.length > 0) {
      getButton()
    } else {
      setButtonDle()
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

  };


  return (
    <div>

      <Row>
        <Col span='8'>{buttonDle}</Col>
        <Col span='8'></Col>
        <Col span='8'>
          <Button >
            添加学生
          </Button>
          <Button>
            批量添加
         </Button>
        </Col>
      </Row>
      <Divider />
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={'id'}
      />
    </div>
  );
}

export default connect()(Tables)
