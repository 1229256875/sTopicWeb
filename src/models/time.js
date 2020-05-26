import { getTime, updateTimeById, getScore, updateScore } from "@/api/api";

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
    },

    * updateTimeById(action, {call, put}) {
      const rst = yield call(updateTimeById, action.payload);
      return rst;
    },

    * getScore(action, {call, put}) {
      const rst = yield call(getScore);
      return rst.data;
    },

    * updateScore(action, {call, put}) {
      const rst = yield call(updateScore, action.payload);
      return rst;
    },
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
