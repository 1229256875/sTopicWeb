import { getPersonInfo } from "@/api/api";

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
