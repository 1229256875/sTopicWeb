import {queryCurrent, query as queryUsers} from "@/services/user";
import {getPersonInfo, getImage, getPictureList, setPicture, insertPicture, register, deleteUser, importPersons} from "@/api/api";
import {act} from "react-dom/test-utils";

const UserModel = {
  namespace: "user",
  state: {
    currentUser: {},
    ids: [],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: "save",
        payload: response
      });

    },

    * fetchCurrent(_, {call, put}) {
      const response = yield call(getPersonInfo);
      yield put({
        type: "saveCurrentUser",
        payload: response.data
      });
    },

    * getImage({payload}, {call, put}) {
      const ret = yield call(getImage, payload);
      return ret.data;
    },

    * getPictureList({payload}, {call, put}) {
      const ret = yield call(getPictureList, payload);
      return ret.data;
    },

    * setPicture({payload}, {call, put}) {
      const ret = yield call(setPicture, payload);
      return ret;
    },

    * insertPicture({payload}, {call, put}) {
      const ret = yield call(insertPicture, payload);
      return ret;
    },

    * register({payload}, {call, put}) {
      const rst = yield call(register, payload);
      return rst;
    },

    * deleteUser({payload}, {call, put}) {
      const rst = yield call(deleteUser, payload);
      return rst;
    },

    * importPersons({payload}, {call, put}) {
      const rst = yield call(importPersons, payload);
      return rst;
    },


    * addDelIds({payload}, {call, put}) {
      yield put({
        type: 'changeIds',
        payload: payload
      })
    }







  },
  reducers: {
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload || {},};
    },

    saveImage(state, action) {
      return {...state, currentUser: action.payload || {},};
    },

    changeIds(state, action) {
      return {...state, ids: action.payload || []}
    },

    changeNotifyCount(
      state = {
        currentUser: {}
      },
      action
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    }
  }
};
export default UserModel;
