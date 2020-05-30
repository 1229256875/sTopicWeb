import styles from "./index.less";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Layout, Spin, Table, Row, Col, Input, Typography, Tag, Timeline, Descriptions, Button, InputNumber, message, Upload, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import { connect } from "dva";
import { withRouter } from 'umi'
import moment from "moment";
import { UploadOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import download from 'downloadjs';

const singData = {
  1: '任务书',
  2: '开题报告',
  3: '初稿',
  4: '二稿',
  5: '三稿',
  6: '终稿',
}

const List = ({ dispatch }) => {

  const { Title, Text } = Typography;
  const { TextArea } = Input;




  const [record, setRecord] = useState(null);

  const [grade, setGrade] = useState(null);

  const [expand, setExpand] = useState(false);

  const [downButton, setDownButton] = useState();

  //进度条 的key
  const [count, setCount] = useState(0);

  const [countt, setCountT] = useState(0)

  const [childrenData, setChildrenData] = useState();

  const [treeData, setTreeData] = useState()

  const getTimeline = (record) => {

    //2020-05-24T21:27:15.000+0000
    const children = [];

    let times = moment(parseInt(Date.parse(record.updateTime))).format("YYYY-MM-DD HH:mm")
    children.push(
      <Timeline.Item key={0} label={'选择题目'}> {times}</Timeline.Item>
    )

    if (dispatch) {
      dispatch({
        type: 'report/getReportList',
        payload: {
          selectId: record.id,
        }
      }).then(rst => {
        setTreeData(rst)
        let now = 0;
        rst && rst.map(item => {
          let lett = item.fileName;
          if (lett.length > 9) {
            lett = lett.substring(0, 9) + '... '
          }
          now = now + 1;
          let times = moment(parseInt(Date.parse(item.updateTime))).format("YYYY-MM-DD HH:mm")
          children.push(
            <Timeline.Item
              key={item.sing}
              label={times}
            >
              <Tooltip title={item.fileName}>
                {lett}
              </Tooltip>
            </Timeline.Item>
          )
        })
        setCount(now)
        setChildrenData(children)
      })
    }
  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'topic/getSelectTopicInfo',
      }).then(rst => {
        if (rst) {
          setGrade(rst.grade);
          setRecord(rst.topic);
        }
      })
    }
  }, [])


  useEffect(() => {
    if (!(record === null)) {
      getTimeline(record)
    }
  }, [record, grade])


  useEffect(() => {
    getDownLoad()
  }, [count])

  useEffect(() =>{
    setCountT(countt + 1)
  }, [downButton])

  const beforeUpload = (file, sing, selectId) =>{
    const formData = new FormData();
    formData.append('multipart', file)
    formData.append('sing', sing)
    formData.append('selectId', selectId)
    if (dispatch){
      dispatch({
        type: 'report/insertReport',
        payload: formData,
      }).then(rst =>{
        if (rst && rst.status === 200){
          message.success(file.name + '文件上传成功');
          getTimeline(record)
          getDownLoad()
        }else {
          message.error('文件上传失败： ' + rst.msg)
        }
      })
    }
  }


  
  //获取下载列表
  const getDownLoad = () => {
    let now = [];
    let i = 1;
    // for (let i = 1; i <= count; i++) {
      treeData && treeData.map(item => {
        let butText = item.fileName;
        if (butText.length > 7){
          butText = butText.substring(0, 7)
        }
      now.push(
        <Row style={{
          marginTop: 5
        }}>
          <Col span={8}>
            <Upload
              // fileList={null}
              beforeUpload={(e) => { beforeUpload(e, item.sing, record.id) }}
            >
              <Tooltip title={item.fileName}>
              <Button
                // key={ + 100}
                // onClick={() => { upLoad(item.sing) }}
              ><UploadOutlined />
              
                {butText} 修改
              </Button>
              </Tooltip>
            </Upload>
          </Col>

          <Col span={8}>
            <Tooltip title={item.fileName}>
            <Button
              // key={i + 100}
              onClick={() => { downLoad(item.sing, item.fileName) }}
            ><DownloadOutlined />{butText} 下载</Button>
            </Tooltip>
          </Col>
        </Row>
      )
    }
    )
   
    now.push(
      <Row style={{
        marginTop: 5
      }}>
        <Col span={8}>
          <Upload 
            key={count + 101}
            beforeUpload={(e) =>{beforeUpload(e, count+ 1, record.id)}}
            >
            <Button
              key={count + 100}
            ><UploadOutlined />新文件上传</Button>
            </Upload>
        </Col>
        <Col span={8}>
          
        </Col>
      </Row>
    )
    setDownButton(now)
  }




  //下载
  const downLoad = (sing, fileName) => {

    dispatch({
      type: 'report/getReport',
      payload: {
        sing: sing,
        selectId: record.id
      }
    }).then(rst => {
      console.log(rst)
      // console.log(rst.getResponseHeader("Content-Disposition"))

      // console.log(rst.headers['Content-Disposition'])
      // console.log(rst.headers['reportFileName'])

      const blod = new Blob([rst.data]);
      if (rst) {
        download(blod, fileName);
      }
    })
  }





  //保留一个专业 信息

  return record != null ? <div>
    <Row gutter={[0, 100]} >
      <Descriptions style={{
        width: '100%'
      }}
        title="课题信息" bordered>
        <Descriptions.Item label="题目名称:">{record.topicName}</Descriptions.Item>
        <Descriptions.Item label="题目类型:">{record.mode === 1 ? '理论型' : '实践型'}</Descriptions.Item>
        <Descriptions.Item label="教师姓名:">{record.teacherName}</Descriptions.Item>
        <Descriptions.Item label="学生专业:">{record.facultyName}</Descriptions.Item>
        <Descriptions.Item label="学生班级:">{record.className}</Descriptions.Item>
        <Descriptions.Item label="学生学年:">{record.year}</Descriptions.Item>
        <Descriptions.Item label="指导教师成绩:">{grade.totorScore}</Descriptions.Item>
        <Descriptions.Item label="答辩成绩:">{grade.defenceScore}</Descriptions.Item>
        <Descriptions.Item label="论文评阅成绩:">{grade.judgeScore}</Descriptions.Item>
        <Descriptions.Item label="最终成绩:">{grade.finalScore}</Descriptions.Item>
        <Descriptions.Item label="题目简介:"
          style={{
            height: 75
          }}
        >{record.info}</Descriptions.Item>
      </Descriptions>
    </Row>
  
    <Row gutter={[0, 20]} style={{
      border: '1px solid #f0f0f0'
    }}>
      <Col span={12}><Timeline mode={'alternate'}>{childrenData}</Timeline></Col>
      <Col span={12}>
        <div>{downButton}</div>
      </Col>
    </Row>
  </div> : <Row ><Title level={4}>未选择任何题目</Title></Row>
}




const Page = ({ location, dispatch }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log(location)
  }, []);

  const { Header, Footer, Content } = Layout;

  return (
    <div>
      <PageHeaderWrapper
        title={'题目详情'}
        className={styles.main}
      >
        <div
          style={{
            // textAlign: "center",
            background: 'white'
          }}
        >
          <List dispatch={dispatch} />
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect()(withRouter(Page));
