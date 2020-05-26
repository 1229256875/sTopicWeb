import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  PictureOutlined,
  PictureFilled
} from "@ant-design/icons";
import { Avatar, Menu, Spin, Badge, Alert, Modal, Form, Input, Button, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { router } from "umi";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";

const AvatarDropdown = (props) =>{

  // const { dispatch } = props;

  const {dispatch, currentUser = {
    avatar: "",
    name: ""
  },
  menu } = props;

  const [state, setState] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
   setState(true)
  };

  const handleOk = e => {
    console.log(e);
   setState(false)
  };

  const handleCancel = e => {
    console.log(e);
    setState(false)
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

    router.push(`/account/${key}`);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const changePwd = e =>{
    console.log(e)
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
          src={"http://127.0.0.1:9986/api/getImage/" + currentUser.code}
          alt="avatar"
        />
        <span className={styles.name}>{currentUser.name}</span>
        <Modal
          title="Basic Modal"
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
              name={'oldPwd'}>
              <Input.Password />
            </Form.Item>

            <Form.Item
            label={'新密码'}
            name={'newPwd'}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
            label={'新密码'}
            name={'newPwd1'}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit"
              > 修改密码</Button>
            </Form.Item>
          </Form>
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
