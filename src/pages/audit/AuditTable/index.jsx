import React, {useEffect, useState} from 'react';

import {Table, Divider, Radio, Button, message, Modal, Spin, Input} from 'antd';

import {connect} from "dva";


const TimeTable = ({dispatch}) => {

  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //返回值
  const [response, setResponse] = useState("");

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
      title: '教师',
      dataIndex: 'teacherName',
      key: '${id}',
    },
    {
      title: '课题类型',
      dataIndex: 'mode',
      key: 'mode',
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
      title: '审核',
      key: 'tags',
      render: (text, record) => {
        return (
          <span>

         <Button
           type={"primary"}
           onClick={() => {
             showHand()
           }}>
          审核
        </Button>
            <Modal
              title="审核"
              visible={visible}
              confirmLoading={false}
              onCancel={handleCancel}
              footer={null}
            >
          <TextArea
            placeholder="请输入审核理由"
            rows={3}
            onChange={(e) => {
              setResponse(e.target.value)
            }}
          />
          <button onClick={() => {
            auditTopic(text.id, 1, response);
            handleCancel()
          }}>通过</button>
          <button onClick={() => {
            auditTopic(text.id, 2, response);
            handleCancel()
          }}>拒绝</button>
        </Modal>
      </span>
        )
      },
    },
  ];

  const {TextArea} = Input;

  const handleCancel = () => {
    setVisible(false)
  };

  const showHand = () => {
    setVisible(true)
  }

  const auditTopic = (id, type, var0) => {
    dispatch({
      type: 'topic/auditTopic',
      payload: {
        type: type,
        id: id,
        response: var0,
      }
    }).then((rst) => {
      console.log("asd", rst);
      if (rst.status === 200) {
        message.success("审核成功");
      } else {
        message.error(rst.data)
      }
    })
  };

  const getData = (type) => {
    dispatch({
      type: 'topic/getTopicList',
      payload: {
        type: type,
      },
    }).then((da) => {
      setTimeData(da)
    })
  };

  useEffect(() => {
    getData(0)
  }, []);

  return (
    <div>
      <Radio.Group
        onChange={({target: {value}}) => {
          setType(value);
          getData(value);
        }}
        value={type}
      >
        <Radio value={0}>未审核</Radio>
        <Radio value={1}>审核已通过</Radio>
        <Radio value={2}>已拒绝</Radio>
      </Radio.Group>

      <Divider/>
      <Table
        columns={columns}
        dataSource={timeData}
        rowKey={count}
      />
    </div>
  )
};

export default connect()(TimeTable);
