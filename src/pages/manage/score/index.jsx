import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useState, useEffect } from "react";
import { Spin, Form, InputNumber, Row, Col, Button, message } from "antd";
import styles from "./index.less";
import { connect } from "dva";





const Page = ({ dispatch }) => {

  const [form] = Form.useForm();

  const List = () => {

    const [formData, setFormData] = useState({})

    const getData = () => {
      if (dispatch) {
        dispatch({
          type: 'time/getScore'
        }).then(rst => {
          if (rst) {
            setFormData(rst)
          }
        })
      }
    }


    useEffect(() => {
      getData()
    }, []);

    useEffect(() => {
      form.resetFields();
    }, [formData])




    const insertGrade = e => {

      console.log(e)
      const { defence, judge, totor } = e;

      let num = defence + judge + totor;

      if (num === 100) {

        dispatch({
          type: 'time/updateScore',
          payload: e
        }).then(rst => {
          if (rst.status === 200) {
            message.success("修改成绩比例成功");
          } else {
            message.error("修改成绩比例失败");
          }
        })
      }else {
        message.error('三个比例相加需要为 100%')
        return;
      }
    }





    return <div>
      <Form
        form={form}
        initialValues={formData}
        onFinish={insertGrade}
        style={{
          border: '1px solid #f0f0f0'
        }}
      >
        <Row gutter={[0, 25]}
          style={{
            marginTop: 10
          }}>
          <Col span={4}></Col>
          <Col span={6}>
            <Form.Item
              label="指导教师成绩比例:"
              name='totor'
            >
              {/* <InputNumber min={0} max={100} /> */}
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='defence'
              label="答辩成绩比例">
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='judge'
              label="评阅成绩比例">
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[0, 50]}>
          <Col span={6}></Col>
          <Button type="primary" htmlType="修改">
            提交</Button>
        </Row>
      </Form>
    </div>
  }


  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <PageHeaderWrapper
      className={styles.main}
    >
      <div
        style={{
          textAlign: "center"
        }}
      >
        <List />
        <Spin spinning={loading} size="large" />
      </div>
    </PageHeaderWrapper>
  );
};



export default connect()(Page)
