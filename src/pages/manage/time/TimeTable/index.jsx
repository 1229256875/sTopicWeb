import React, { useEffect, useState } from "react";

import { Table, Tag, DatePicker, Button } from "antd";
import { connect } from "dva";
import moment from "moment";

const TimeTable = ({ dispatch }) => {
  const [timeData, setTimeData] = useState([]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id"
    },
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
        return <DatePicker defaultValue={moment(parseInt(data))} />;
      }
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      render: data => {
        return <DatePicker defaultValue={moment(parseInt(data))} />;
      }
    },
    {
      title: "修改",
      key: "tags",
      render: (text, record) => {
        console.log(text);
        console.log(record);
        return (
          <span>
            <Button
              type={"primary"}
              onClick={() => {
                timeChange(text);
              }}
            >
              修改
            </Button>
          </span>
        );
      }
    }
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <span>
    //       <a style={{ marginRight: 16 }}>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </span>
    //   ),
    // },
  ];

  const timeChange = time => {
    console.log(time);
  };

  useEffect(() => {
    dispatch({
      type: "time/getTime"
    }).then(da => {
      setTimeData(da);
    });
  }, []);

  return (
    <div>
      <Table columns={columns}
             dataSource={timeData}
             pagination={false}
             rowkey={'id'}
      />
    </div>
  );
};

export default connect()(TimeTable);
