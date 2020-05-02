import React, { Component } from "react";
import { Tag, message, Modal } from "antd";
import ReconnectingWebSocket from "reconnecting-websocket";
import { connect } from "dva";
import groupBy from "lodash/groupBy";
import moment from "moment";
import NoticeIcon from "../NoticeIcon";
import styles from "./index.less";
import { useEffect, useState } from "react";


//定义 websocket connection
let options = {
  maxRetries: 5
};



const GlobalHeaderRight = (props) => {
  const [webSocket, setWebSocket] = useState()
  const { dispatch } = props;
  const [count, setCount] = useState(0);

  const [visible, setVisible] = useState(false)

  const webSocketConnection = () => {
    const ws = new WebSocket("ws://127.0.0.1:9986/socket/" + localStorage.getItem("code"));
    // setWebSocket(ws)
    
 

    let result = "";

    ws.onopen = e => {
      console.log('连接上 ws 服务端了');
      // ws.send(JSON.stringify({ flag: 'wsUrl', data: "Hello WebSocket!" }));
    }
    ws.onmessage = (msg) => {
      // console.log('接收服务端发过来的消息: %o', msg);
      var msgJson = JSON.parse(msg.data);
      if (msgJson && msgJson.type === 1){
        console.log('message',msgJson.message)
      }else if(msgJson && msgJson.type === 2){
        setCount(msgJson.count)
      }else(
        console.log('非法数据',msgJson)
      )
      // result += msgJson.MsgBody + '\n';
      // if (msgJson.MsgCode == "999999") {//多设备在线的异常发生时;
      //   window.location.href = '/#/';
      // } else if (msgJson.MsgCode == "555555") {//用户退出系统的时候;
      //   ws.close();
      //   window.location.href = '/#/';
      // }
      // alert(msgJson.MsgBody);
    };
    ws.onclose =  (e) => {
      console.log('ws 连接关闭了');
      console.log(e);
    }

  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "global/fetchNotices"
      });
    }
    webSocketConnection();
  }, []);

  const changeReadState = clickedItem => {
    const { id } = clickedItem;

    if (dispatch) {
      dispatch({
        type: "global/changeNoticeReadState",
        payload: id
      });
    }
  };
  const handleNoticeClear = (title, key) => {
    message.success(`${"清空了"} ${title}`);

    if (dispatch) {
      dispatch({
        type: "global/clearNotices",
        payload: key
      });
    }
  };
  const getNoticeData = () => {
    const { notices = [] } = props;

    if (!notices || notices.length === 0) {
      return {};
    }

    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: "",
          processing: "blue",
          urgent: "red",
          doing: "gold"
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, "type");
  };
  const getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  const showModal = () => {
    console.log('asd')
    setVisible(true)
  };

  const handleOk = e => {
    console.log(e);
    setVisible(false)
  };

  const handleCancel = e => {
    console.log(e);
    setVisible(false)
  };

  const { currentUser, fetchingNotices, onNoticeVisibleChange } = props;
  const noticeData = getNoticeData();
  const unreadMsg = getUnreadData(noticeData);

  return (
    <div>
    <NoticeIcon
      className={styles.action}
      count={count}
      onItemClick={item => {
        changeReadState(item);
      }}
      loading={fetchingNotices}
      clearText="清空"
      viewMoreText="查看更多"
      onClear={handleNoticeClear}
      onPopupVisibleChange={onNoticeVisibleChange}
      onViewMore={showModal}
      clearClose
    >
      {/*<NoticeIcon.Tab*/}
      {/*  tabKey="notification"*/}
      {/*  count={unreadMsg.notification}*/}
      {/*  list={noticeData.notification}*/}
      {/*  title="通知"*/}
      {/*  emptyText="你已查看所有通知"*/}
      {/*  showViewMore*/}
      {/*/>*/}
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="消息"
        emptyText="您已读完所有消息"
        showViewMore
      />
      {/*<NoticeIcon.Tab*/}
      {/*  tabKey="event"*/}
      {/*  title="待办"*/}
      {/*  emptyText="你已完成所有待办"*/}
      {/*  count={unreadMsg.event}*/}
      {/*  list={noticeData.event}*/}
      {/*  showViewMore*/}
      {/*/>*/}
    </NoticeIcon>
    <Modal
          title="Basic Modal"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
    </div>
  );
};

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects["global/fetchMoreNotices"],
  fetchingNotices: loading.effects["global/fetchNotices"],
  notices: global.notices
}))(GlobalHeaderRight);
