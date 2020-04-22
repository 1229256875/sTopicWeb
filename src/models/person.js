import { getPersonInfo, updateUser } from "@/api/api";

const Model = {
  namespace: "person",
  state: {
    personInfo: []
  },
  effects: {
    *getPersonInfo({ payload }, { call, put }) {
      const response = yield call(getPersonInfo, payload);
      yield put({
        type: "setPersonInfo",
        payload: response.data
      });
      return response.data;
    },

    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload);
      return response;
    }
  },

  reducers: {
    setPersonInfo(state, { payload }) {
      return {
        ...state,
        personInfo: payload
      };
    }
  }
};
export default Model;
