import {getPersonList} from "@/api/api";

const Model = {
  namespace: "manage",
  state: {
    persons: []
  },
  effects: {
    * getPersonList({payload}, {call, put}) {
      const response = yield call(getPersonList, payload);
      // yield put({
      //   type: "setPersonInfo",
      //   payload: response.data
      // });
      return response.data;
    },

    * updateUser({payload}, {call, put}) {
      const response = yield call(updateUser, payload);
      return response;
    }
  },

  reducers: {
    setPersonInfo(state, {payload}) {
      return {
        ...state,
        persons: payload
      };
    }
  }
};
export default Model;
