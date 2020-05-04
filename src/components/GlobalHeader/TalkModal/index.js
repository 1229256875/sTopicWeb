import React, { useEffect, useState, useMemo, useRef } from "react";
import { Modal, Alert, Input } from "antd";
import { connect } from "dva";
import styles from "./index.less";

const TalkModal = props => {
  const { notices2, ...restProps } = props;
  const fromKeys = Object.keys(notices2);
  // const defaultKey = fromKeys[0] || '';
  const [selectKey, setSelectKey] = useState();
  const message = notices2[selectKey]?.message || [];
  const [meNotices, setMeNotices] = useState({});
  const meMessage = meNotices[selectKey]?.message || [];
  const [text, setText] = useState("");
  const messageEnd = useRef(null);

  const allMessage = [...message, ...meMessage].sort((a, b) => a.time - b.time);

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView();
      // messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessage]);

  useEffect(() => {
    if(selectKey) {
      // 进入的时候清除
    }
  },[selectKey])

  const send = () => {
    if (selectKey && text) {
      setMeNotices({
        ...meNotices,
        ...(meNotices[selectKey]
          ? {
              [selectKey]: {
                message: [
                  ...meNotices[selectKey].message,
                  {
                    message: text,
                    time: new Date().valueOf(),
                    type: 2
                  }
                ]
              }
            }
          : {
              [selectKey]: {
                message: [
                  {
                    message: text,
                    time: new Date().valueOf(),
                    type: 2
                  }
                ]
              }
            })
      });
      setText('')
      // 请求后端，发送内容
    }
  };

  const left = useMemo(
    () => (
      <div className={styles.left}>
        {fromKeys.map(key => (
          <div
            key={key}
            className={`${styles.nameItem} ${key === selectKey &&
              styles.selectName}`}
            onClick={() => setSelectKey(key)}
          >
            {notices2[key].fromName}
          </div>
        ))}
      </div>
    ),
    [JSON.stringify(fromKeys), selectKey]
  );

  const right = (
    <div className={styles.right}>
      <div className={styles.read}>
        {allMessage.map(({ message: theM, type = 1 }, i) => (
          <div
            key={i.toString()}
            className={styles.message}
            style={{ justifyContent: type === 1 ? "flex-start" : "flex-end" }}
          >
            <Alert
              message={theM}
              type={type === 1 ? "success" : "info"}
              style={{ maxWidth: "70%", flex: "0 0 auto" }}
            />
          </div>
        ))}
        <div ref={messageEnd} />
      </div>

      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 3 }}
        className={styles.write}
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );

  return (
    <Modal
      {...restProps}
      visible
      bodyStyle={{ padding: 0 }}
      okText="发送"
      cancelButtonProps={{ style: { display: "none" } }}
      onOk={send}
    >
      <div className={styles.content}>
        {left}
        {right}
      </div>
    </Modal>
  );
};

export default connect(({ global }) => ({ notices2: global.notices2 }))(
  TalkModal
);
