import React, { useEffect, useState } from "react";

import { Table, Tag, DatePicker, Button, Modal, Input, message } from "antd";
import { connect } from "dva";
import moment from "moment";

const TimeTable = ({ dispatch }) => {
  //总数据
  const [timeData, setTimeData] = useState([]);

  const [visible, setVisible] = useState(false);

  //范围时间选择数据
  const [timeDate, setTimeDate] = useState([]);

  //单个选中数据
  const [selectDate, setSelectDate] = useState({})

  const [count,setCount] = useState(0)

  const { RangePicker } = DatePicker;
  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id"
    // },
    {
      title: "名称",
      dataIndex: "timeName",
      key: "timeName"
      // render: text => <a>{text}</a>,
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      render: data => {
        let times = moment(parseInt(data)).format("YYYY-MM-DD HH:mm")
        return <span> {times}</span>;
      }
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      render: data => {
        let times = moment(parseInt(data)).format("YYYY-MM-DD HH:mm")
        return <span> {times}</span>;
      }
    },
    {
      title: "修改",
      key: "tags",
      render: (text, record) => {
        return (
          <span>
            <Button
              type={"primary"}
              onClick={() => { openModal(record) }}
            >
              修改
            </Button>
          </span>
        );
      }
    }
  ];

  const openModal = (e) => {
    const { startTime, endTime } = e;
    // moment(parseInt(startTime)).format("YYYY-MM-DD HH:mm:ss")
    setSelectDate(e)
    timeDate.push(moment(parseInt(startTime)))
    timeDate.push(moment(parseInt(endTime)))
    setCount(count+1)
    console.log('asd', count)
    setVisible(true)
  }


  const handleOk = () => {
    selectDate.createTime=null,
    selectDate.updateTime=null;
    if (dispatch) {
      dispatch({
        type: 'time/updateTimeById',
        payload: selectDate,
      }).then((rst) => {
        if (rst && rst.status === 200) {
          message.success('修改成功')
          getData();
          setTimeout(() => {
            handleCancel()
          }, 500);
        } else {
          if (rst && rst.msg !== null ) {
            message.error(rst.msg)
          } else {
            message.error('修改失败')
          }
        }
      })
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setSelectDate(null)
    
    setTimeDate([])
  }

  const onChange = (e) => {
    if (e) {
      const start = e[0].valueOf();
      const end = e[1].valueOf();
      selectDate.startTime = start;
      selectDate.endTime = end;
    }

  }
  const nameChange = e => {
    if (e.target.value) {
      selectDate.timeName = e.target.value
    }
  }



  useEffect(() => {
    getData()
  }, []);


  const getData = () =>{
    dispatch({
      type: "time/getTime"
    }).then(da => {
      setTimeData(da);
    });
  }

  return (
    <div>
      <Table columns={columns}
        dataSource={timeData}
        pagination={false}
        rowkey={'id'}
      />
      <Modal
        title="修改起止时间"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <span style={{
            marginRight: 27
          }}>名称:</span>
          <Input
            defaultValue={selectDate && selectDate.timeName}
            placeholder={'请输入名称'}
            style={{
              width: 250
            }}
            onChange={nameChange}
          />
        </div>
        <div style={{
          marginTop: 30
        }}>
          <span>起止时间:</span>
          <RangePicker
            showTime={{ format: 'YYYY-MM-DD HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            defaultValue={timeDate}
            onChange={onChange}
            key={count}
          />
        </div>
      </Modal>
    </div>
  );
};

export default connect()(TimeTable);