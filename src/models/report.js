import { deleteReport, getReport, getReportList, uploadReport  } from "@/api/api";

const Model = {
  namespace: "report",
  state: {

  },

  effects: {
    * deleteReport({payload}, {call}) {
        const rst = yield call(deleteReport, payload)
        return rst;
    },

    * getReport({payload}, {call}) {
        const rst = yield call(getReport, payload)
        return rst;
    },

    * getReportList({payload}, {call}) {
        const rst = yield call(getReportList, payload)
        return rst.data;
    },

    * insertReport({payload}, {call}) {
        const rst = yield call(uploadReport, payload)
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
