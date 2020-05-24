import {
  insertTopic,
  getTopicList,
  auditTopic,
  getHistoryTopic,
  deleteTopic,
  updateTopic
} from "@/api/api";

const Model = {
  namespace: "topic",
  state: {
    a: [],
    topicList: []
  },

  effects: {
    *insertTopic({ payload }, { call, put }) {
      const response = yield call(insertTopic, payload);
      return response;
    },

    *getTopicList({ payload }, { call, put }) {
      const response = yield call(getTopicList, payload);

      return response.data;
    },

    *auditTopic({ payload }, { call, put }) {
      const response = yield call(auditTopic, payload);
      return response;
    },

    *getHistoryTopic({ payload }, { call, put }) {
      const response = yield call(getHistoryTopic, payload);
      return response.data;
    },

    * updateTopic({ payload }, { call }) {
      const rst = yield call(updateTopic, payload);
      return rst;
    },

    *deleteTopic({ payload }, { call, put }) {
      const response = yield call(deleteTopic, payload);
      return response;
    }
  },
  reducers: {}
};
export default Model;
