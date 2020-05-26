import { PageHeaderWrapper } from "@ant-design/pro-layout";
import styles from "./index.less";
import React, { useState, useEffect, useRef } from "react";
import { message, Spin, Modal, Button, Input } from "antd";
import G6 from "@antv/g6";
import { connect } from "dva";


const Faculty = props => {
  const [count, setCount] = useState(0);
  const timeOut = useRef(null);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);

  //添加院系 按钮文字
  const [addButtonText, setAddButtonText] = useState("添加");
  //添加院系按钮是否可按
  const [addButtonVisible, setAddButtonVisible] = useState(false);

  //当前节点数据
  const [nodeData, setNodeData] = useState();

  const [inputText, setInputText] = useState("");
  //树
  const [graphs, setGraph] = useState(null);

  const { dispatch } = props;

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = e => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const insertFaculty = () => {
    dispatch({
      type: "faculty/insertFaculty",
      payload: {
        type: nodeData.teep + 1,
        facultyName: inputText,
        parentId: nodeData.shape
      }
    }).then(rst => {
      if (rst && rst.status === 200 ) {
        message.success("修改成功！");
      } else {
        message.error(rst && rst.msg);
      }
    });
    setCount(count + 1);
    handleCancel();
  };

  const updateFaculty = () => {
    dispatch({
      type: "faculty/updateFaculty",
      payload: {
        id: nodeData.shape,
        facultyName: inputText,
        // type: nodeData.teep,
        // parentId: nodeData.shape,
      }
    }).then(rst => {
      if (rst && rst.status === 200) {
        message.success("修改成功！");
      } else {
        message.error(rst && rst.msg);
      }
    });
    setCount(count + 1);
    handleCancel();
  };

  const deleteFaculty = () => {
    dispatch({
      type: "faculty/deleteFaculty",
      payload: {
        id: nodeData.shape,
      }
    }).then(rst => {
      if (rst && rst.status === 200) {
        message.success("修改成功！");
      } else {
        message.error(rst && rst.msg);
      }
    });
    setCount(count + 1);
    handleCancel();
  };

  useEffect(() => {
    dispatch({
      type: "faculty/getFacultyAll"
    }).then(data => {
      if (data === null){
        return;
      }
      if (graphs) {
        graphs.data(data);
        graphs.changeData();
      } else {
        const width = document.getElementById('container').scrollWidth;
        const height = document.getElementById('container').scrollHeight || 500;
        const graph = new G6.TreeGraph({
          container: 'container',
          width,
          height,
          modes: {
            default: [
              {
                type: 'collapse-expand',
                onChange: function onChange(item, collapsed) {
                  const data = item.get('model').data;
                  data.collapsed = collapsed;
                  return true;
                },
              },
              'drag-canvas',
              'zoom-canvas',
            ],
          },
          defaultNode: {
            size: 26,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            style: {
              fill: '#C6E5FF',
              stroke: '#5B8FF9',
            },
          },
          defaultEdge: {
            type: 'cubic-horizontal',
            style: {
              stroke: '#A3B1BF',
            },
          },
          layout: {
            type: 'compactBox',
            direction: 'LR',
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap() {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            },
          },
        });

        graph.node(function (node) {
          return {
            label: node.id,
            labelCfg: {
              offset: 10,
              position: node.children && node.children.length > 0 ? 'left' : 'right',
            },
          };
        });

        graph.on('node:mouseenter', function (evt) {
          const node = evt.item;
          const model = node.getModel();
          model.oriLabel = model.label;
          graph.setItemState(node, 'hover', true);
          graph.updateItem(node, {
            label: '放置1.5S后触发修改',
            labelCfg: {
              style: {
                fill: '#003a8c',
              },
            },
          });
          timeOut.current = setTimeout(() => {

            console.log(model);
            setNodeData(model);
            setInputText(model.id);
            if (model.teep === 1) {
              setAddButtonText("添加专业");
              setAddButtonVisible(false);
            } else if (model.teep === 2) {
              setAddButtonText("添加班级");
              setAddButtonVisible(false);
            } else {
              setAddButtonText("添加");
              setAddButtonVisible(true);
            }
            setVisible(true);
          }, 1500);
        });

        graph.on('node:mouseleave', function (evt) {
          const node = evt.item;
          const model = node.getModel();
          graph.setItemState(node, 'hover', false);
          graph.updateItem(node, {
            label: model.oriLabel,
            labelCfg: {
              style: {
                fill: '#555',
              },
            },
          });
          clearTimeout(timeOut.current);
        });

        graph.data(data);
        graph.render();
        graph.fitView();
        setGraph(graph);
      }
    });
  }, [count]);

  return (
    <PageHeaderWrapper className={styles.main}>
      <Modal
        title="学院管理"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Input
          placeholder="Basic usage"
          defaultValue={inputText}
          value={inputText}
          onChange={e => {
            setInputText(e.target.value);
          }}
        />
        <Button
          type="primary"
          onClick={insertFaculty}
          disabled={addButtonVisible}
          styles={{

          }}
        >
          {addButtonText}
        </Button>
        <Button onClick={updateFaculty}>修改</Button>
        <Button
          type="primary"
          onClick={deleteFaculty}
          danger
        >
          删除
        </Button>
      </Modal>
      <div id={"container"}></div>
      {/* <Spin spinning={loading} size="large"></Spin> */}
    </PageHeaderWrapper>
  );
};

export default connect()(Faculty);