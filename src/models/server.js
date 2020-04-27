import { getJvmInfo } from "@/api/api";

const Model = {
  namespace: "server",
  state: {
    user: []
  },

  effects: {
    * server({ payload }, { call, put }) {
      const response = yield call(getJvmInfo);
      console.log(response)
      return response;
    },

  },

  reducers: {
    setServerInfo(state, { payload }) {
      return {
        ...state,
        personInfo: payload
      };
    }
  }
};
export default Model;
