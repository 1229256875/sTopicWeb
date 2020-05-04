import React, { Component } from "react";
import { Tag, message, Modal } from "antd";
import ReconnectingWebSocket from "reconnecting-websocket";
import { connect } from "dva";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { useEffect, useState } from "react";
import { url } from "@/utils/const";
import TalkModal from "./TalkModal";
import NoticeIcon from "../NoticeIcon";
import styles from "./index.less";

// 定义 websocket connection
let options = {
  maxRetries: 5
};

const GlobalHeaderRight = props => {
  // const [webSocket, setWebSocket] = useState();
  const {
    dispatch,
    noticesModal,
    currentUser,
    fetchingNotices,
    notices2
  } = props;
  const [count, setCount] = useState(0);
  const [ws, setWs] = useState(null);
  const [three, setThree] = useState([]);
  const [newThree, setNewThree] = useState();
  const [newNotice, setNewNotice] = useState();
  const { visible } = noticesModal;
  const setVisible = val => {
    dispatch({
      type: "global/changeNoticesModal",
      payload: {
        visible: val
      }
    });
  };

  const setNotice2 = v => {
    dispatch({
      type: "global/changeNotices2",
      payload: v
    });
  };

  useEffect(() => {
    if (newThree) {
      setThree([
        ...(three.length >= 3
          ? three.slice(three.length - 2, three.length)
          : three),
        newThree
      ]);
    }
  }, [newThree]);

  useEffect(() => {
    if (newNotice) {
      const fromCode = Object.keys(newNotice)[0];
      setNotice2({
        ...notices2,
        ...(notices2[fromCode]
          ? {
              [fromCode]: {
                ...notices2[fromCode],
                message: [
                  ...notices2[fromCode].message,
                  ...newNotice[fromCode].message
                ]
              }
            }
          : newNotice)
      });
    }
  }, [newNotice]);

  const webSocketConnection = () => {
    const wss = new WebSocket(
      `${url.ws}/socket/${localStorage.getItem("code")}`
      // "ws://127.0.0.1:9986/socket/" + localStorage.getItem("code")
    );
    // setWebSocket(wss)

    let result = "";

    wss.onopen = e => {
      console.log("连接上 ws 服务端了");
      // ws.send(JSON.stringify({ flag: 'wsUrl', data: "Hello WebSocket!" }));
    };
    wss.onmessage = msg => {
      // console.log('接收服务端发过来的消息: %o', msg);
      const msgJson = JSON.parse(msg.data);
      if (msgJson && msgJson?.type === 2) {
        setCount(msgJson.count);
      } else {
        const fromCode = Object.keys(msgJson)[0];

        setNewNotice(msgJson);
        setNewThree(msgJson[fromCode]);
      }
    };
    wss.onclose = e => {
      console.log("ws 连接关闭了");
      console.log(e);
    };
    setWs(wss);
  };

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

  const changeNoticesVisible = v => {
    dispatch({
      type: "global/changeNoticesVisible",
      payload: v
    });
  };

  const showModal = () => {
    console.log("asd");
    changeNoticesVisible(false);
    setVisible(true);
  };

  const handleOk = e => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = e => {
    console.log(e);
    setVisible(false);
  };

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
        onViewMore={showModal}
        clearClose
      >
        {/* <NoticeIcon.Tab
          tabKey="notification"
          count={unreadMsg.notification}
          list={noticeData.notification}
          title="通知"
          emptyText="你已查看所有通知"
          showViewMore
        /> */}
        <NoticeIcon.Tab
          tabKey="message"
          count={count}
          list={three}
          title="消息"
          emptyText="您已读完所有消息"
          showViewMore
        />
        {/* <NoticeIcon.Tab
          tabKey="event"
          title="待办"
          emptyText="你已完成所有待办"
          count={unreadMsg.event}
          list={noticeData.event}
          showViewMore
        /> */}
      </NoticeIcon>
      <TalkModal title="聊天框" visible={visible} onCancel={handleCancel} />
        
    </div>
  );
};

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects["global/fetchMoreNotices"],
  fetchingNotices: loading.effects["global/fetchNotices"],
  notices: global.notices,
  noticesModal: global.noticesModal,
  notices2: global.notices2
}))(GlobalHeaderRight);
