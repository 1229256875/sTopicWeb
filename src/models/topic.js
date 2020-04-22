import {
  insertTopic,
  getTopicList,
  auditTopic,
  getHistoryTopic,
  deleteTopic
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

    *deleteTopic({ payload }, { call, put }) {
      const response = yield call(deleteTopic, payload);
      return response;
    }
  },
  reducers: {}
};
export default Model;
