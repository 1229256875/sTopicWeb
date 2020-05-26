import {
  insertTopic,
  getTopicList,
  auditTopic,
  getHistoryTopic,
  deleteTopic,
  updateTopic,
  insertGrade,
  getTopicGrade,
  getSelectTopicInfo
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
    },

    *insertGrade({payload}, {call}) {
      const rst = yield call(insertGrade, payload);
      return rst;
    },

    *getTopicGrade({payload}, {call}){
      const rst = yield call(getTopicGrade, payload);
      return rst.data;
    },

    *getSelectTopicInfo({payload}, {call}) {
      const rst = yield call(getSelectTopicInfo, payload);
      return rst.data;
    }
    
  },
  reducers: {}
};
export default Model;
