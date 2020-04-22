import { stringify } from "querystring";
import { router } from "umi";
import { fakeAccountLogin, getFakeCaptcha } from "@/services/login";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { Login, Verify, getPersonInfo } from "@/api/api";
import { routerRedux } from "dva/router";

const Model = {
  namespace: "login",
  state: {
    status: undefined,
    touxiang:
      "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    name: "MAOKAI",
    person: {}
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(Login, payload);
      if (response.status === 200 && response.data.status === 200) {
        yield setAuthority(response.data.type);
        yield put({
          type: "changeLoginStatus",
          payload: response.data
        });
        yield put(routerRedux.replace("/welcome"));
      }
      return response;
    },

    // * getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    *getPerson({ payload }, { call, put }) {
      const response = yield call(getPersonInfo, payload);
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      setAuthority("guest");
      if (window.location.pathname !== "/user/login" && !redirect) {
        router.replace({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href
          })
        });
      }
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log("person", payload.person);
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
        name: payload.person.name,
        touxiang:
          "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
        person: payload.person
      };
    }
  }
};
export default Model;
