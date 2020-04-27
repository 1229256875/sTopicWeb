import React, {useState, useEffect,} from "react";
import {Button, Divider, Popconfirm, Spin, Table} from "antd";
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
      title: "编号",
      dataIndex: "code",
      key: "code"
      // render: text => <a>{text}</a>,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: 'name'
    },
    {
      title: "院系",
      dataIndex: "facultyName",
      key: "mode",
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "qq",
      dataIndex: "qq",
      key: "qq"
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
          <div>
            <Popconfirm
              title={"Are you sure? "}
              okText={"Yes"}
              onConfirm={() => {
                // deleteTopic(text.id);
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

  useEffect(() => {
    const var1 = {
      type: 1
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
