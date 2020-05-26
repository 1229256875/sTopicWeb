import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Layout, Spin, Table, Form, Row, Col, Input, Typography, Tag, Timeline, Descriptions, Button, InputNumber, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { connect } from "dva";
import { withRouter } from 'umi'
import moment from "moment";
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less'


const singData = {
  1: '任务书',
  2: '开题报告',
  3: '初稿',
  4: '二稿',
  5: '三稿',
  6: '终稿',
}

const List = ({ info, dispatch }) => {

  const { Title, Text } = Typography;
  const { TextArea } = Input;



  const { state: { record } } = info;

  const [expand, setExpand] = useState(false);

  const [form] = Form.useForm();

  const [downButton, setDownButton] = useState();

  //进度条 的key
  const [count, setCount] = useState(0);

  const [childrenData, setChildrenData] = useState();

  const [formData, setFormData] = useState();


  const getTimeline = () => {

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
        let now = 0;
        rst && rst.map(item => {
          now = now + 1;
          let times = moment(parseInt(Date.parse(item.updateTime))).format("YYYY-MM-DD HH:mm")
          children.push(
            <Timeline.Item
              key={item.sing}
              label={times}
            >
              {singData[item.sing] + '上传'}</Timeline.Item>
          )
        })
        setCount(now)
        setChildrenData(children)
      })
    }
  }


  useEffect(() => {
    getTimeline()
    getGrade()
  }, [])

  useEffect(() => {
    getDownLoad()
  }, [count])

  useEffect(() => {
    form.resetFields();
  }, [formData])

  const getDownLoad = () => {
    let now = [];
    for (let i = 1; i <= count; i++) {
      now.push(
        <Row style={{
          marginTop: 5
        }}>
          <Col span={8}>
            <Button
              key={i + 100}
              onClick={() => { upLoad(i) }}
            ><UploadOutlined />{singData[i]}上传</Button>
          </Col>
          <Col span={8}>
            <Button
              key={i + 100}
              onClick={() => { downLoad(i) }}
            ><DownloadOutlined />{singData[i]}下载</Button>
          </Col>
        </Row>
      )
    }
    setDownButton(now)
  }

  //获取成绩
  const getGrade = () => {
    if (dispatch) {
      dispatch({
        type: 'topic/getTopicGrade',
        payload: {
          selectId: record.id,
        }
      }).then(rst => {
        setFormData(rst)
      })
    }
  }

  const insertGrade = values => {

    const value = {
      ...values,
      // facultyId: facultyIds[facultyIds.length - 1],
      id: record.id,
    };
    console.log('123', value)
    if (dispatch) {
      dispatch({
        type: 'topic/insertGrade',
        payload: value,
      }).then(rst => {
        if (rst && rst.status === 200) {
          message.success('设置成绩成功')
        } else {
          message.error(rst.msg)
        }
      })
    }
  }

  //下载
  const downLoad = (sing) => {
    console.log('topc', record.id)
    console.log('type', sing)
  }

  //上传
  const upLoad = (sing) => {
    console.log('topc', record.id)
    console.log('type', sing)
  }



  //保留一个专业 信息

  return <div>
    <Row gutter={[0, 100]} >
      <Descriptions style={{
        width: '100%'
      }} title="课题信息" bordered>
        <Descriptions.Item label="题目名称:">{record.topicName}</Descriptions.Item>
        <Descriptions.Item label="题目类型:">{record.mode === 1 ? '理论型' : '实践型'}</Descriptions.Item>
        <Descriptions.Item label="选题学生:">{record.studentName}</Descriptions.Item>
        <Descriptions.Item label="学生专业:">{record.facultyName}</Descriptions.Item>
        <Descriptions.Item label="学生班级:">{record.className}</Descriptions.Item>
        <Descriptions.Item label="学生学年:">{record.year}</Descriptions.Item>
        <Descriptions.Item label="题目简介:"
          style={{
            height: 75
          }}
        >{record.info}</Descriptions.Item>
      </Descriptions>
    </Row>
    {/* <Row gutter={[12, 30]} >
      <Col span={8}><Title level={4}>题目名称: <Tag>{record.topicName}</Tag></Title></Col>

      <Col span={8}><Title level={4}>题目类型: <Tag>{record.mode === 1 ? '理论型' : '实践型'}</Tag></Title></Col>

      <Col span={8}><Title level={4}>选题学生: <Tag>{record.studentName}</Tag></Title></Col>
    </Row>

    <Row gutter={[12, 30]} >
      <Col span={8}><Title level={4}>学生专业: <Tag>{record.facultyName}</Tag></Title></Col>
      <Col span={8}><Title level={4}>学生班级: <Tag>{record.className}</Tag></Title></Col>
      <Col span={8}><Title level={4}>学生学年: <Tag>{record.year}</Tag></Title></Col>
    </Row>
    <Row gutter={[0, 30]} >
      <Col span={2}><Title level={4}>题目简介:</Title></Col>
      <Col span={22}><TextArea value={record.info} rows={3} style={{ width: 600 }}></TextArea></Col>
    </Row> */}
    <Row gutter={[0, 20]} style={{
      border: '1px solid #f0f0f0'
    }}>
      <Col span={12}><Timeline mode={'alternate'}>{childrenData}</Timeline></Col>
      <Col span={12}>
        {downButton}
      </Col>
    </Row>

    <Form
      form={form}
      initialValues={formData}
      onFinish={insertGrade}
      style={{
        border: '1px solid #f0f0f0'
      }}
    >
      <Row gutter={[0, 5]} 
      style={{
        marginTop: 10
      }}>
        <Col span={4}></Col>
        <Col span={6}>
          <Form.Item
            label="指导教师成绩:"
            name='totorScore'
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='defenceScore'
            label="答辩成绩">
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Col>
      </Row>


      <Row gutter={[0, 20]}>
        <Col span={4}></Col>
        <Col span={6}>
          <Form.Item
            name='judgeScore'
            label="论文评阅成绩">
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='finalScore'
            label="最终成绩">
            <InputNumber disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[0, 50]}>
        <Col span={4}></Col>
        <Button type="primary" htmlType="修改">
          提交成绩</Button>
      </Row>
    </Form>
  </div>
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
          <List info={location} dispatch={dispatch} />
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect()(withRouter(Page));