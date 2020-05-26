import React, {useEffect, useState} from "react";

import {Table, Divider, Button, message, Input, Tooltip, Form, Radio, Modal} from "antd";

import {connect} from "dva";
import {log} from "lodash-decorators/utils";

const TimeTable = ({dispatch}) => {

  const [timeData, setTimeData] = useState([]);
  const [wiveVisible, setWiveVisible] = useState(false);
  //课题详情 from表单
  const [formData, setFormData] = useState({});
  //表头复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();

  const layout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 12
    }
  };

  const columns = [
    // {
    //   title: 'Id',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: "课题名称",
      dataIndex: "topicName",
      render: info => {
        let tee = info;
        if (tee && tee.length > 7){
          tee = tee.substring(0, 7)+'...';
        }
        return (
          <Tooltip title={info}>
            <span>{tee}</span>
          </Tooltip>
        );
      }
    },
    {
      title: "教师",
      dataIndex: "teacherName",
      key: "${id}"
    },
    {
      title: "课题类型",
      dataIndex: "mode",
      key: "mode",
      render: mode => {
        let state = "";
        if (mode === 1) {
          state = "实践型";
        } else if (mode === 2) {
          state = "理论型";
        }
        return <div>{state}</div>;
      }
    },
    {
      title: "面向学年",
      dataIndex: "year",
      key: "year",
      sorter: {
        compare: (a, b) => a.year - b.year,
        multiple: 2
      }
    },
    {
      title: "院系名称",
      dataIndex: "facultyName",
      key: "facultyName"
    },
    {
      title: "课程信息",
      dataIndex: "info",
      key: "info",
      render: info => {
        let tee = info;
        if (tee && tee.length > 6){
          tee = tee.substring(0, 6)+'...';
        }
        return (
          <Tooltip title={info}>
            <span>{tee}</span>
          </Tooltip>
        );
      }
    },
    // {
    //   title: "操作",
    //   key: "tags",
    //   render: (text, record) => {
    //     return (
    //       <span>
    //         <Button onClick={() => {
    //           onModal(text)
    //         }}>查看</Button>
    //       </span>
    //     );
    //   }
    // }
  ];

  const onModal = (text) => {
    setFormData(text);
    console.log(text)
    setWiveVisible(true);
  }

  useEffect(() => {
    form.resetFields();
  }, [formData])


  const handleCancel = () => {
    setWiveVisible(false)
  }

  const getData = () => {
    dispatch({
      type: "topic/getHistoryTopic"
    }).then(rst => {
      rst.map((item) => {
        item.key = item.id
      })
      setTimeData(rst);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = () => {
    setWiveVisible(false)
  }

  const onFinishFailed = () => {

  }

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Divider/>
      <Table
        columns={columns}
        dataSource={timeData}
        rowSelection={rowSelection}
        // rowKey={count}
      />
      <Modal title="查看"
             visible={wiveVisible}
             confirmLoading={false}
             onCancel={handleCancel}
             footer={null}>

        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={formData}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            width: 500
          }}
        >
          <Form.Item
            label="课题名称: "
            name="topicName"
            rules={[
              {
                required: true,
                message: "请输入课题名称!"
              }
            ]}
            size={300}
          >
            <Input disabled/>
          </Form.Item>

          <Form.Item
            label="课题类型: "
            name="mode"
            rules={[
              {
                required: true,
                message: "请选择课题类型!"
              }
            ]}
          >
            <Radio.Group>
              <Radio.Button value={2}>理论型</Radio.Button>
              <Radio.Button value={1}>实践型</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="面向院系: "
            name="facultyName"
            rules={[
              {
                required: true,
                message: "请选择面向院系!"
              }
            ]}
          >
            <Input disabled/>
          </Form.Item>

          <Form.Item
            label="课题信息: "
            name="info"
            rules={[
              {
                required: true,
                message: "请输入课题信息!"
              }
            ]}
          >
            <Input.TextArea disabled/>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="修改">
              关闭
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect()(TimeTable);
