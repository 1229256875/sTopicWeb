import React, { useState, useEffect, } from "react";
import { Button, Divider, Popconfirm, Spin, Table, Tooltip, Select, Form, Row, Col, Upload, Modal, Input, Radio, DatePicker, Cascader, message, InputNumber } from "antd";
import { connect } from "dva";
import { Link } from 'umi'
import { getAuthority } from '@/utils/authority'
import { UploadOutlined } from '@ant-design/icons';



const Tables = ({ dispatch, delIds }) => {

  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({})

  const [form] = Form.useForm();

  //表头复选框
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [buttonDle, setButtonDle] = useState()

  const [visible, setVisible] = useState(false)

  const [cascader, setCascader] = useState()

  const [select, setSelect] = useState('code')

  const [searchView, setSelectView] = useState()

  const [count, setCount] = useState(0)

  const [serachText, setSerachText] = useState('请输入搜索内容')



  const { Search } = Input;

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 12 },
    },
  };

  const columns = [
    {
      title: "学号",
      dataIndex: "code",
      // render: text => <a>{text}</a>,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "院系",
      dataIndex: "facultyName",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "qq",
      dataIndex: "qq",
    },
    {
      title: "学年",
      dataIndex: "year",
    },
    {
      title: "个人信息",
      dataIndex: "info",
      render: (text, record) => {
        let info = text;
        if (info && info.length > 6) {
          info = info.substring(0, 6) + '...';
        }
        return <Tooltip title={text}>
          <span>{info}</span>
        </Tooltip>
      }
    },

    {
      title: "操作",
      key: "tags",
      render: (text, record) => {
        return (
          <div>
            <Button type={'primary'}>
              <Link to={{ pathname: "/manage/personInfo", state: { record } }}>查看</Link >
            </Button>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    getCascader()
    getData()
    getSelectView()
  }, []);


  //清除form表单中的值
  useEffect(() => {
    form.resetFields();
  }, [formData])


  const getData = payload => {
    const value = {
      ...payload,
      type: 2,
    }

    if (dispatch) {
      dispatch({
        type: 'manage/getPersonList',
        payload: value
      }).then((rst) => {
        setData(rst)
      })
    }
  };

  //获取删除按钮
  const getButton = (sing) => {
    const authority = getAuthority()[0]
    const buttonDle = []
    if (authority === 'admin') {
      buttonDle.push(
        <Popconfirm
          title={"是否要删除选中学生?"}
          okText={"Yes"}
          onConfirm={() => delPerson(sing)}
          cancelText={"No"}
        >
          <Button danger type='primary'>删除</Button>
        </Popconfirm>
      )
    }
    setButtonDle(buttonDle)
  }

  const onSelectChange = selectedRowKeys => {

    setSelectedRowKeys(selectedRowKeys)

    dispatch({
      type: 'user/addDelIds',
      payload: selectedRowKeys
    })


    if (selectedRowKeys.length > 0) {
      getButton(selectedRowKeys)
    } else {
      setButtonDle()
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const { TextArea } = Input;

  const toModal = () => {

    const modal = []

    modal.push(
      <Modal
        title='添加学生账户'
        visible={visible}
        onCancel={handleCancel}
        onOk={okkModal}
      >
        <Form
          form={form}
          {...formItemLayout}
        >
          <Form.Item
            name="code"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: false, message: '请输入姓名' }]}
          >
            <InputNumber min={10} max={120} />
          </Form.Item>

          <Form.Item
            label="性别: "
            name="sex"
            rules={[
              {
                required: true,
                message: "请选择课题类型!"
              }
            ]}
          >
            <Radio.Group buttonStyle="solid" value={2}>
              <Radio.Button value={1}>男</Radio.Button>
              <Radio.Button value={2}>女</Radio.Button>
            </Radio.Group>
          </Form.Item>


          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: false, message: '请输入电话' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mail"
            label="邮箱"
            rules={[{ required: false, message: '请输入邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="qq"
            label="QQ"
            rules={[{ required: false, message: '请输入QQ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="year"
            label="学年"
            rules={[{ required: true, message: '请选择学年' }]}
          >
            <DatePicker picker="year" />
          </Form.Item>

          <Form.Item
            name="faculty"
            label="院系&班级"
            rules={[
              { type: 'array', required: true, message: '请选择院系&班级' },
            ]}
          >
            <Cascader options={cascader} />
          </Form.Item>


          <Form.Item
            name="info"
            label="个人信息简介"
            rules={[{ required: false, message: '请输入个人信息' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    )
    return modal
  }

  const showModal = () => {
    // getData()
    setVisible(true)
    getCascader()
  }

  const handleCancel = e => {
    setVisible(false)
  };

  const okkModal = (e) => {

    form.validateFields()
      .then(values => {

        values = {
          ...values,
          year: values.year.format('YYYY'),
          type: 2,
          classId: values.faculty[1],
          facultyId: values.faculty[0],
        }
        if (dispatch) {
          dispatch({
            type: 'user/register',
            payload: values
          }).then(rst => {
            if (rst && rst.status === 200) {
              getData()
              form.resetFields()
              message.success('添加成功')
            } else {
              if (rst.msg) {
                message.error(rst.msg)
              } else {
                message.error('添加失败')
              }
            }
          })
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
  }

  const getCascader = () => {
    if (dispatch) {
      dispatch({
        type: 'faculty/getCascader',
      }).then(rst => {
        setCascader(rst)
      })
    }
  }


  //删除用户
  const delPerson = (info ) => {

    if (dispatch){
      dispatch({
        type: 'user/deleteUser',
        payload: info,
      }).then(rst => {
        if (rst && rst.status === 200) {
          message.success('删除成功')
          getData()
        } else {
          message.error(rst.msg)
        }
      })
    }
  }



  const selectOnChang = e => {
    getSelectView(e)
  }

  const onSumber = (e, sing) => {
    console.log('qwe', e)
    const value = {
      code: sing === 'code' ? e : null,
      name: sing === 'name' ? e : null,
      facultyId: sing === 'faculty' ? e : null,
      classId: sing === 'class' ? e[1] : null,
      year: sing === 'year' ? e : null,
    }

    getData(value)
  }

  const getSelectView = (e = 'code') => {
    const view = []

    view.push(<Search
      allowClear
      placeholder={serachText}
      onSearch={info => onSumber(info, e)}
      style={{ width: '40%' }}
    />)

    switch (e) {
      case 'code': 
      case 'name':
      case 'year': setSelectView(view); break
      case 'faculty': setSelectView(getClassList(view));break
      case 'class': getFacultyList(); break
    }
  }


  const getFacultyList = () => {
    const sing = []
    sing.push(<Cascader
      style={{
         width: '40%',
         textAlign: 'left'
        }}
      placeholder="请选择班级"
      onChange={sing => onSumber(sing, 'class')}
      options={cascader} />
    )
    setSelectView(sing)
  }

  const getClassList = () => {

    return <Select
      style={{ width: '40%' }}
      placeholder="请选择专业"
      optionFilterProp="children"
      onChange={sing =>onSumber(sing, 'faculty')}
      options={cascader}
    />
  
  }

  const beforeUpload = (file) => {
    const formData = new FormData();
    formData.append('multipart', file);
    formData.append('type', 2)
    dispatch({
      type: 'user/importPersons',
      payload: formData,
    }).then(rst => {
      if (rst && rst.status === 200) {
        message.success(file.name + '文件上传成功');
        getData()
      } else {
        message.error('文件上传失败： ' + rst.msg)
      }
    })
  }




  return (
    <div>

      <Row>
        <Col span='2'>{buttonDle}</Col>
        <Col span='16'>
          <Select defaultValue="学号" onChange={selectOnChang}>
            <Option value="code">学号</Option>
            <Option value="name">姓名</Option>
            <Option value="faculty">专业</Option>
            <Option value="class">班级</Option>
            <Option value="year">学年</Option>
          </Select>
          {searchView}
        </Col>
        <Col span='6'>
          <Button onClick={showModal}>
            添加学生
          </Button>
          <Upload
            // fileList={null}
            beforeUpload={tar =>beforeUpload(tar)}
          >
            <Button>
              <UploadOutlined />
              批量导入
              </Button>
          </Upload>
        </Col>
      </Row>
      <Divider />
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={'id'}
      />
      {toModal()}
    </div>
  );
}

export default connect(({ user }) => ({ delIds: user.ids }))(Tables)
