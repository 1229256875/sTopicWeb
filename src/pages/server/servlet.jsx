import React, { useEffect, useState, useRef } from "react";

import { Layout, Row, Col, Tag, message, Button, Table, Tooltip } from "antd";

import moment from "moment";
import { connect } from "dva";
import styles from './index.less'
import axios from "axios";
import { push } from "umi/src/router";
import { url } from '@/utils/const';


const getUri = () => {
  return url.http
}

const keyList = [
  {
    params: 'jvm.memory.max',
    desc: 'JVM 最大内存',
    key: 'jvm_memory_max',
  },
  {
    params: 'jvm.memory.committed',
    desc: 'JVM 可用内存',
    key: 'jvm_memory_committed',
  },
  {
    params: 'jvm.memory.used',
    desc: 'JVM 已用内存',
    key: 'jvm_memory_used'
  },
  {
    params: 'jvm.buffer.memory.used',
    desc: 'JVM 缓冲区已用内存',
    key: 'jvm_buffer_memory_used'
  },
  {
    params: 'jvm.buffer.count',
    desc: '当前缓冲区数量',
    key: 'jvm_buffer_count'
  },
  {
    params: 'jvm.threads.daemon',
    desc: 'JVM 守护线程数量',
    key: 'jvm_threads_daemon'
  },
  {
    params: 'jvm.threads.live',
    desc: 'JVM 当前活跃线程数量',
    key: 'jvm_threads_live'
  },
  {
    params: 'jvm.threads.peak',
    desc: 'JVM 峰值线程数量',
    key: 'jvm_threads_peak'
  },
  {
    params: 'jvm.classes.loaded',
    desc: 'JVM 已加载 Class 数量',
    key: 'jvm_classes_loaded'
  },
  {
    params: 'jvm.classes.unloaded',
    desc: 'JVM 未加载 Class 数量',
    key: 'jvm_classes_unloaded'
  },
  {
    params: 'jvm.gc.memory.allocated',
    desc: 'GC 时, 年轻代分配的内存空间',
    key: 'jvm_gc_memory_allocated'
  },
  {
    params: 'jvm.gc.memory.promoted',
    desc: 'GC 时, 老年代分配的内存空间',
    key: 'jvm_gc_memory_promoted'
  },
  {
    params: 'jvm.gc.max.data.size',
    desc: 'GC 时, 老年代的最大内存空间',
    key: 'jvm_gc_max_data_size'
  },
  {
    params: 'jvm.gc.live.data.size',
    desc: 'FullGC 时, 老年代的内存空间',
    key: 'jvm_gc_live_data_size'
  },
  {
    params: 'jvm.gc.pause.count',
    desc: '系统启动以来GC 次数',
    key: 'jvm_gc_pause_count'
  },
  {
    params: 'jvm.gc.pause.totalTime',
    desc: '系统启动以来GC 总耗时',
    key: 'jvm_gc_pause_totalTime'
  },
  {
    params: 'system.cpu.count',
    desc: 'CPU 数量',
    key: 'system_cpu_count'
  },
  {
    params: 'system.cpu.usage',
    desc: '系统 CPU 使用率',
    key: 'system_cpu_usage'
  },
  {
    params: 'process.start.time',
    desc: '应用启动时间点',
    key: 'process_uptime'
  },
  {
    params: 'process.uptime',
    desc: '应用已运行时间',
    key: 'process_start_time'
  },
  {
    params: 'process.cpu.usage',
    desc: '当前应用 CPU 使用率',
    key: 'process_cpu_usage'
  }
]

const ServerTable = ({ dispatch }) => {
  const [dataInfo, setDataInfo] = useState([]);
  const [count, setCount] = useState(0);
  const timeout = useRef(null);
  const [tableData, setData] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false)
  const [url, setUrl] = useState(getUri)
  
  const getData = () => {
    axios.all([
      axios.get(url + '/actuator/metrics/jvm.memory.max'),
      axios.get(url + '/actuator/metrics/jvm.memory.committed'),
      axios.get(url + '/actuator/metrics/jvm.memory.used'),
      axios.get(url + '/actuator/metrics/jvm.buffer.memory.used'),
      axios.get(url + '/actuator/metrics/jvm.buffer.count'),
      axios.get(url + '/actuator/metrics/jvm.threads.daemon'),
      axios.get(url + '/actuator/metrics/jvm.threads.live'),
      axios.get(url + '/actuator/metrics/jvm.threads.peak'),
      axios.get(url + '/actuator/metrics/jvm.classes.loaded'),
      axios.get(url + '/actuator/metrics/jvm.classes.unloaded'),
      axios.get(url + '/actuator/metrics/jvm.gc.memory.allocated'),
      axios.get(url + '/actuator/metrics/jvm.gc.memory.promoted'),
      axios.get(url + '/actuator/metrics/jvm.gc.max.data.size'),
      axios.get(url + '/actuator/metrics/jvm.gc.live.data.size'),
      axios.get(url + '/actuator/metrics/jvm.gc.pause'),
      axios.get(url + '/actuator/metrics/system.cpu.count'),
      axios.get(url + '/actuator/metrics/system.cpu.usage'),
      axios.get(url + '/actuator/metrics/process.uptime'),
      axios.get(url + '/actuator/metrics/process.start.time'),
      axios.get(url + '/actuator/metrics/process.cpu.usage')
    ]).then((rst) => {
      const value = {
        jvm_memory_max: (rst[0].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_memory_committed: (rst[1].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_memory_used: (rst[2].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_buffer_memory_used: (rst[3].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_buffer_count: rst[4].data.measurements[0].value + ' 个',
        jvm_threads_daemon: rst[5].data.measurements[0].value + ' 个',
        jvm_threads_live: rst[6].data.measurements[0].value + ' 个',
        jvm_threads_peak: rst[7].data.measurements[0].value + ' 个',
        jvm_classes_loaded: rst[8].data.measurements[0].value + ' 个',
        jvm_classes_unloaded: rst[9].data.measurements[0].value + ' 个',
        jvm_gc_memory_allocated: (rst[10].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_gc_memory_promoted: (rst[11].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_gc_max_data_size: (rst[12].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_gc_live_data_size: (rst[13].data.measurements[0].value / 1048576).toFixed(3) + ' MB',
        jvm_gc_pause_count: rst[14].data.measurements[0].value + ' 次',
        jvm_gc_pause_totalTime: (rst[14].data.measurements[1].value / 1048576).toFixed(3) + ' 秒',
        system_cpu_count: rst[15].data.measurements[0].value + ' 核',
        system_cpu_usage: (rst[16].data.measurements[0].value / 1048576).toFixed(3) + '%',
        process_uptime: (rst[17].data.measurements[0].value / 1048576).toFixed(3) + ' 秒',
        process_start_time: (rst[18].data.measurements[0].value / 1048576).toFixed(3) + ' 秒',
        process_cpu_usage: (rst[19].data.measurements[0].value / 1048576).toFixed(3) + '%',
      };
      value.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')

      const valueList = keyList.map(({ params, desc, key }) => ({ params, desc, val: value[key] }))
      setData(valueList);
      setDataInfo(value)
    }).catch((error) => {
      message.error(error)
    });
    setButtonLoading(false)
  };

  useEffect(() => {
    getData();
  }, [count]);

  useEffect(() => {
    timeout.current = setInterval(() => {
      getData()
    }, 5000);

    return () => clearInterval(timeout.current)
  }, []);

  const columns = [
    {
      title: "参数",
      dataIndex: "params",
    },
    {
      title: "描述",
      dataIndex: "desc",
    },
    {
      title: "当前值",
      dataIndex: "val",
    }
  ];


  return (
    <div>
      <div>
        上次数据获取时间：{dataInfo.time}
        <Button loading={buttonLoading}
          type="primary"
          onClick={() => {
            setButtonLoading(true)
            setCount(count + 1)
          }}>
          刷新
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
      // rowKey={count}
      />

    </div>
  );
};

export default connect()(ServerTable);
