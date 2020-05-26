import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  PictureOutlined,
  PictureFilled
} from "@ant-design/icons";
import { Avatar, Menu, Spin, Badge, Alert, Modal } from "antd";
import React, { useEffect } from "react";
import { connect } from "dva";
import { router } from "umi";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";

class AvatarDropdown extends React.Component {

  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onMenuClick = event => {
    const { key } = event;
    

    if (key === "logout") {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: "login/logout"
        });
      }

      return;
    }

    if (key === "changePwd") {
      console.log(123);
      // this.onModle();
      this.showModal();
      return;
    }

    router.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: "",
        name: ""
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
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
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
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
}

export default connect(({ user }) => ({
  currentUser: user.currentUser
}))(AvatarDropdown);
