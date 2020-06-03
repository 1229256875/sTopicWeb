import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  PictureOutlined,
  PictureFilled,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Spin, Badge, Alert, Modal, Form, Input, Button, message, Popconfirm, Row, Col, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { router } from "umi";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";
import time from "@/pages/manage/time";
import ImgCrop from 'antd-img-crop';


const AvatarDropdown = (props) => {

  // const { dispatch } = props;

  const { dispatch, currentUser = {
    avatar: "",
    name: ""
  },
    menu } = props;

  const [state, setState] = useState(false);

  const [picture, setPicture] = useState(false)

  const [form] = Form.useForm();

  const [avatarList, setAvatarList] = useState()

  const [avatar, setAvatar] = useState()

  const [page, setPage] = useState(1)

  const [viewPicture, setViewPicture] = useState()

  const [viewText, setViewText] = useState('Upload new avatar ')

  const [personPicture, setPersonPicture] = useState()


  const showModal = () => {
    setState(true)
  };

  const handleOk = e => {
    console.log(e);
    setState(false)
  };

  const handleCancel = e => {
    // console.log(e);
    setState(false)
    setPicture(false)
  };

  const onMenuClick = event => {
    const { key } = event;


    if (key === "logout") {

      if (dispatch) {
        dispatch({
          type: "login/logout"
        });
      }

      return;
    }

    if (key === "changePwd") {
      console.log(123);
      showModal();
      return;
    }

    if (key === 'changePicture') {
      getPictureList()
      setPicture(true)
      return;
    }

    router.push(`/account/${key}`);
  };

  const getPictureList = (page = 1, count = 10) => {
    const value = {
      page: page,
      count: count,
    }

    if (dispatch) {
      dispatch({
        type: 'user/getPictureList',
        payload: value
      }).then(rst => {
        setAvatarList(rst)
      })
    }
  }

  const setPicturea = id => {
    if (dispatch) {
      dispatch({
        type: 'user/setPicture',
        payload: {
          id: id,
        }
      }).then(rst => {
        if (rst && rst.status === 200) {
          getPicture()
          message.success("修改成功")
          handleCancel()
        } else {
          message.error("修改失败")
        }
      })
    }
  }

  //获取头像显示
  useEffect(() => {
    const o = []
    avatarList && avatarList.map(item => {
      const a = 'data:image/png;base64,' + item.picture;
      // o.push(<img width="100" height="100" src={a}></img>)
      o.push(
        <Popconfirm
          title="是否选择改头像作为自己的头像?"
          onConfirm={() => setPicturea(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <Avatar
            size={81}
            src={a}
            srcSet={a}
            icon={<UserOutlined />}
          />
        </Popconfirm>
      )
    })
    o.push(<Button onClick={() => {
      getPictureList(page + 1, 10)
      setPage(page + 1)
    }}><DownOutlined />下一页</Button>)
    setAvatar(o)
  }, [avatarList])


  const [fileList, setFileList] = useState([
  ]);

  // const onChange = ({ fileList: newFileList }) => {

  //   setFileList(newFileList);
  // };

  //上传
  const beforeUpload = (file) => {

    const formData = new FormData();
    formData.append('multipart', file)
    formData.append('isUser', 1)
    if (dispatch) {
      dispatch({
        type: 'user/insertPicture',
        payload: formData,
      }).then(rst => {
        if (rst && rst.status === 200) {
          let { data: { picture } } = rst;

          let ima = <img width="100" height="100" src={'data:image/png;base64,' + picture}></img>
          setViewPicture(ima)
          setViewText(viewText + 'again')
          getPicture()
          message.success('头像修改成功');
          handleCancel()
        } else {
          message.error('文件修改失败： ' + rst.msg)
        }
      })
    }
  }

  useEffect(() => {
    getPicture()
  },[])

  const getPicture = () => {
    dispatch({
      type: 'user/getImage',
      payload: {
        picId: currentUser.code,
      }
    }).then(rst => {
      setPersonPicture(rst.picture)
    })
  }



  const onPreview = async file => {
    let src = file.url;
    // if (!src) {
    //   src = await new Promise(resolve => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file.originFileObj);
    //     reader.onload = () => resolve(reader.result);
    //   });
    // }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };




  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const changePwd = e => {
    if (e.newPwd === e.newPwd1) {
      if (e.newPwd.length < 6 || e.newPwd.length > 16) {
        message.error("密码长度为 6 ～ 16");
        return;
      }
      dispatch({
        type: 'login/changePwd',
        payload: e
      }).then(rst => {
        if (rst && rst.status === 200) {
          message.success('修改密码成功')
          handleCancel()
          form.resetFields()
        } else {
          message.error(rst && rst.msg)
        }
      })
    } else {
      message.error('新密码两次输入不一致')
    }
  }

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={onMenuClick}
    >
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
            个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
            个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="changePicture">
        <PictureFilled />
        <span>修改头像</span>
      </Menu.Item>

      <Menu.Item key="changePwd">
        <SettingOutlined />
        <span>修改密码</span>
      </Menu.Item>

      <Menu.Item key="logout">
        <LogoutOutlined />
          退出登录
        </Menu.Item>
    </Menu>
  );

  return currentUser && currentUser.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={'data:image/png;base64,'+ personPicture}
          alt="avatar"
        />
        <span className={styles.name}>{currentUser.name}</span>
        <Modal
          title="修改密码"
          visible={state}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >

          <Form
            onFinish={changePwd}
            {...layout}
            form={form}>
            <Form.Item
              label={'旧密码'}
              name={'oldPwd'}
              rules={[{ required: true, message: '请输入旧密码' }]}
            >
              <Input.Password placeholder="请输入旧密码" />
            </Form.Item>

            <Form.Item
              label={'新密码'}
              name={'newPwd'}
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
              label={'重复新密码'}
              name={'newPwd1'}
              rules={[{ required: true, message: '请再次输入新密码' }]}
            >
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit"
              > 修改密码</Button>
            </Form.Item>
          </Form>
        </Modal>


        <Modal
          title="修改头像"
          visible={picture}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width='45%'
        >
          <Row offset={[0, 50]}>{avatar}</Row>

          <Row offset={[0, 50]}>
            <ImgCrop rotate>
              <Upload

                listType="picture-card"
                fileList={fileList}
                // onChange={onChange}
                beforeUpload={beforeUpload}
                onPreview={onPreview}
              >

                {viewPicture}{viewText}
              </Upload>
            </ImgCrop>
          </Row>
        </Modal>
      </span>
    </HeaderDropdown>
  ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8
        }}
      />
    );
}

export default connect(({ user }) => ({
  currentUser: user.currentUser
}))(AvatarDropdown);
