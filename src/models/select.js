import { selectTopic, searchTopic, teacherAudit } from "@/api/api";

const Model = {
  namespace: "select",
  state: {
    personInfo: []
  },
  effects: {
    *select({ payload }, { call, put }) {
      const response = yield call(selectTopic, payload);
      return response;
    },

    *searchTopic({ payload }, { call, put }) {
      const rst = yield call(searchTopic, payload);
      return rst.data;
    },

    *teacherAudit({ payload }, { call }) {
      const rst = yield call(teacherAudit, payload);
      return rst;
    }
  },

  reducers: {
    setPersonInfoA(state, { payload }) {
      return {
        ...state,
        personInfo: payload
      };
    }
  }
};
export default Model;
