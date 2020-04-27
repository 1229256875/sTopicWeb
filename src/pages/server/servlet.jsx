import React, {useEffect, useState, useRef} from "react";

import {Layout, Row, Col, Tag, message, Button} from "antd";

import {Get} from "react-axios";
import moment from "moment";
import {connect} from "dva";
import styles from './index.less'
import axios from "axios";

const ServerTable = ({dispatch}) => {
  const [dataInfo, setDataInfo] = useState([]);
  const [count, setCount] = useState(0);
  const timeout = useRef(null);

  const [url, setUrl] = useState('http://127.0.0.1:9986');
  const [buttonLoading, setButtonLoading] = useState(false)

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
        jvm_memory_max: (rst[0].data.measurements[0].value / 1048576).toFixed(3),
        jvm_memory_committed: (rst[1].data.measurements[0].value / 1048576).toFixed(3),
        jvm_memory_used: (rst[2].data.measurements[0].value / 1048576).toFixed(3),
        jvm_buffer_memory_used: (rst[3].data.measurements[0].value / 1048576).toFixed(3),
        jvm_buffer_count: rst[4].data.measurements[0].value,
        jvm_threads_daemon: rst[5].data.measurements[0].value,
        jvm_threads_live: rst[6].data.measurements[0].value,
        jvm_threads_peak: rst[7].data.measurements[0].value,
        jvm_classes_loaded: rst[8].data.measurements[0].value,
        jvm_classes_unloaded: rst[9].data.measurements[0].value,
        jvm_gc_memory_allocated: (rst[10].data.measurements[0].value / 1048576).toFixed(3),
        jvm_gc_memory_promoted: (rst[11].data.measurements[0].value / 1048576).toFixed(3),
        jvm_gc_max_data_size: (rst[12].data.measurements[0].value / 1048576).toFixed(3),
        jvm_gc_live_data_size: (rst[13].data.measurements[0].value / 1048576).toFixed(3),
        jvm_gc_pause_count: rst[14].data.measurements[0].value,
        jvm_gc_pause_totalTime: (rst[14].data.measurements[1].value / 1048576).toFixed(3),
        system_cpu_count: rst[15].data.measurements[0].value,
        system_cpu_usage: (rst[16].data.measurements[0].value / 1048576).toFixed(3),
        process_uptime: (rst[17].data.measurements[0].value / 1048576).toFixed(3),
        process_start_time: (rst[18].data.measurements[0].value / 1048576).toFixed(3),
        process_cpu_usage: (rst[19].data.measurements[0].value / 1048576).toFixed(3),
      };
      value.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
      setDataInfo(value)
    }).catch((error) => {
      message.error(error)
    });
    setButtonLoading(false)
  };

  useEffect(() => {
    console.log("主动刷新")
    getData();
  }, [count]);

  useEffect(() => {
    timeout.current = setInterval(() => {
      console.log("定时刷新")
      getData()
    }, 5000);

    return () => clearInterval(timeout.current)
  },[])
  //
  // setInterval(() => {
  //   console.log("定时刷新")
  //   getData()
  // }, 1000)




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
      <div style={styles.jvmInfo}>
        <table>
          <tr>
            <th>参数</th>
            <th>描述</th>
            <th>当前值</th>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">jvm.memory.max</a-tag>
            </td>
            <td>JVM 最大内存</td>
            <td>{dataInfo.jvm_memory_max} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">jvm.memory.committed</a-tag>
            </td>
            <td>JVM 可用内存</td>
            <td>{dataInfo.jvm_memory_committed} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">jvm.memory.used</a-tag>
            </td>
            <td>JVM 已用内存</td>
            <td>{dataInfo.jvm_memory_used} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="cyan">jvm.buffer.memory.used</a-tag>
            </td>
            <td>JVM 缓冲区已用内存</td>
            <td>{dataInfo.jvm_buffer_memory_used} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="cyan">jvm.buffer.count</a-tag>
            </td>
            <td>当前缓冲区数量</td>
            <td>{dataInfo.jvm_buffer_count} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="green">jvm.threads.daemon</a-tag>
            </td>
            <td>JVM 守护线程数量</td>
            <td>{dataInfo.jvm_threads_daemon} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="green">jvm.threads.live</a-tag>
            </td>
            <td>JVM 当前活跃线程数量</td>
            <td>{dataInfo.jvm_threads_live} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="green">jvm.threads.peak</a-tag>
            </td>
            <td>JVM 峰值线程数量</td>
            <td>{dataInfo.jvm_threads_peak} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="orange">jvm.classes.loaded</a-tag>
            </td>
            <td>JVM 已加载 Class 数量</td>
            <td>{dataInfo.jvm_classes_loaded} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="orange">jvm.classes.unloaded</a-tag>
            </td>
            <td>JVM 未加载 Class 数量</td>
            <td>{dataInfo.jvm_classes_unloaded} 个</td>
          </tr>
          <tr>
            <td>
              <a-tag color="pink">jvm.gc.memory.allocated</a-tag>
            </td>
            <td>GC 时, 年轻代分配的内存空间</td>
            <td>{dataInfo.jvm_gc_memory_allocated} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="pink">jvm.gc.memory.promoted</a-tag>
            </td>
            <td>GC 时, 老年代分配的内存空间</td>
            <td>{dataInfo.jvm_gc_memory_promoted} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="pink">jvm.gc.max.data.size</a-tag>
            </td>
            <td>GC 时, 老年代的最大内存空间</td>
            <td>{dataInfo.jvm_gc_max_data_size} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="pink">jvm.gc.live.data.size</a-tag>
            </td>
            <td>FullGC 时, 老年代的内存空间</td>
            <td>{dataInfo.jvm_gc_live_data_size} MB</td>
          </tr>
          <tr>
            <td>
              <a-tag color="blue">jvm.gc.pause.count</a-tag>
            </td>
            <td>系统启动以来GC 次数</td>
            <td>{dataInfo.jvm_gc_pause_count} 次</td>
          </tr>
          <tr>
            <td>
              <a-tag color="blue">jvm.gc.pause.totalTime</a-tag>
            </td>
            <td>系统启动以来GC 总耗时</td>
            <td>{dataInfo.jvm_gc_pause_totalTime} 秒</td>
          </tr>
          <tr>
            <td>
              <a-tag color="green">system.cpu.count</a-tag>
            </td>
            <td>CPU 数量</td>
            <td>{dataInfo.system_cpu_count} 核</td>
          </tr>
          <tr>
            <td>
              <a-tag color="green">system.cpu.usage</a-tag>
            </td>
            <td>系统 CPU 使用率</td>
            <td>{dataInfo.system_cpu_usage} %</td>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">process.start.time</a-tag>
            </td>
            <td>应用启动时间点</td>
            <td>{dataInfo.process_uptime} 秒</td>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">process.uptime</a-tag>
            </td>
            <td>应用已运行时间</td>
            <td>{dataInfo.process_start_time} 秒</td>
          </tr>
          <tr>
            <td>
              <a-tag color="purple">process.cpu.usage</a-tag>
            </td>
            <td>当前应用 CPU 使用率</td>
            <td>{dataInfo.process_cpu_usage} %</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default connect()(ServerTable);
