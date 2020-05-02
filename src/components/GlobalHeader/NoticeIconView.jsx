import React, { Component } from "react";
import { Tag, message } from "antd";
import { connect } from "dva";
import groupBy from "lodash/groupBy";
import moment from "moment";
import NoticeIcon from "../NoticeIcon";
import styles from "./index.less";
import { useEffect } from "react";

const GlobalHeaderRight = (props) => {

  const { dispatch } = props;


  const webSocketConnection = () => {
    const { currentUser } = props;
    console.log(currentUser)
    const websocket = new WebSocket("ws://127.0.0.1:9986/code/"+ currentUser.code);
    websocket.open().then(() =>{
      message.info('连接成功')
    });
  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "global/fetchNotices"
      });
    }
    // webSocketConnection();
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

  const { currentUser, fetchingNotices, onNoticeVisibleChange } = props;
  const noticeData = getNoticeData();
  const unreadMsg = getUnreadData(noticeData);

  return (
    <NoticeIcon
      className={styles.action}
      count={currentUser && currentUser.unreadCount}
      onItemClick={item => {
        changeReadState(item);
      }}
      loading={fetchingNotices}
      clearText="清空"
      viewMoreText="查看更多"
      onClear={handleNoticeClear}
      onPopupVisibleChange={onNoticeVisibleChange}
      onViewMore={() => message.info("Click on view more")}
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
  );
};

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects["global/fetchMoreNotices"],
  fetchingNotices: loading.effects["global/fetchNotices"],
  notices: global.notices
}))(GlobalHeaderRight);
