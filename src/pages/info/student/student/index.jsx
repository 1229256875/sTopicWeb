import React, {useState, useEffect,} from "react";
import {Button, Divider, Popconfirm, Spin, Table, Tooltip} from "antd";
import {connect} from "dva";


const Tables = ({dispatch}) => {

  const [data, setData] = useState([]);

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
      render: (text, record) =>{
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
      title: "个人信息",
      dataIndex: "info",
    },

    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button >
              发消息
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


  return (
    <div>
      <Divider/>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={'id'}
      />
    </div>
  );
}

export default connect()(Tables)
