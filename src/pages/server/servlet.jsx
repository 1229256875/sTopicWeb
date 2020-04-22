import React, { useEffect, useState } from "react";

import { Layout } from "antd";

import { connect } from "dva";

const ServerTable = ({ dispatch }) => {
  const [timeData, setTimeData] = useState([]);
  const [count, setCount] = useState(0);

  const getData = () => {
    dispatch({
      type: "topic/getHistoryTopic"
    }).then(rst => {
      setTimeData(rst);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return <div></div>;
};

export default connect()(ServerTable);
