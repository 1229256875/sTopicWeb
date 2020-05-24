import { getFacultyList, getFacultyAll, deleteFaculty, insertFaculty, updateFaculty  } from "@/api/api";

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
    },

    *getFacultyAll(action, {call, put}) {
      const rst = yield call(getFacultyAll)
      return rst.data;
    },

    *insertFaculty(action, {call, put}) {
      const rst = yield call(insertFaculty, action.payload)
      return rst;
    },

    *updateFaculty(action, {call, put}) {
      console.log('asd', action.payload)
      const rst = yield call(updateFaculty, action.payload);
      return rst;
    },

    * deleteFaculty(action, {call, put}) {
      console.log('asd', action.payload)
       const rst = yield call(deleteFaculty, action.payload);
      return rst;
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
