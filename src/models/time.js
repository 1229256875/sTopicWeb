import { getTime } from "@/api/api";

const Model = {
  namespace: "time",
  state: {
    a: []
  },

  effects: {
    *getTime(action, { call, put }) {
      const response = yield call(getTime);
      // yield put({
      //   type: 'setTime',
      //   payload: response
      // });
      return response.data;
    }
  },
  reducers: {
    setTime(state, { payload }) {
      return {
        ...state,
        a: payload
      };
    }
  }
};
export default Model;
