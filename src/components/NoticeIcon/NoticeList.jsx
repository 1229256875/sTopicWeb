import { Avatar, List } from "antd";
import React from "react";
import classNames from "classnames";
import styles from "./NoticeList.less";
import { connect } from "dva";

const NoticeList = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  dispachet
}) => {




  if (!data || data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }

  return (
    <div>
      <List
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read
          }); // eslint-disable-next-line no-nested-ternary

          // const leftIcon = item.avatar ? (
          //   typeof item.avatar === "string" ? (
          //     <Avatar className={styles.avatar} src={item.avatar} />
          //   ) : (
          //     <span className={styles.iconElement}>{item.avatar}</span>
          //   )
          // ) : null;


          // <Avatar className={styles.avatar} src={item.avatar} />
          const leftIcon = item.fromCode ? (
            typeof item.fromCode === "string" ? (
              <Avatar className={styles.avatar} src={"http://127.0.0.1:9986/api/getImage/" + item.fromCode} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick && onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.fromName}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.message[0].message}</div>
                    {/* <div className={styles.datetime}>{item.message[0]}</div> */}
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={e => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default connect()(NoticeList);
