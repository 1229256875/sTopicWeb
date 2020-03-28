import {insertTopic, getTopicList, auditTopic} from "@/api/api";

const Model = {
  namespace: "topic",
  state: {
    a: [],
    topicList: [],
  },

  effects: {
    * insertTopic({payload}, {call, put}) {
      const response = yield call(insertTopic, payload);
      console.log(response);
      return response;
    },

    * getTopicList({payload}, {call, put}){
      const response = yield call(getTopicList, payload);

      return response.data;
    },

    * auditTopic({payload}, {call, put}){
      const response = yield call(auditTopic, payload);
      console.log(response);
      return response;
    }
  },
  reducers: {

  }

};
export default Model;
