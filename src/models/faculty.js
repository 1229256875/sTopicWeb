import { getFacultyList } from "@/api/api";

const Model = {
  namespace: "faculty",
  state: {
    a: []
  },

  effects: {
    *getFacultyList(action, { call, put }) {
      const response = yield call(getFacultyList);
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
