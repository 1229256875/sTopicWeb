import http from "@/axios/http";

//  登陆
export function Login(params) {
  return http.post("/api/login", params);
}

// 验证账号
export function Verify(params) {
  return http.get("/api/verify", params);
}

//获取时间
export function getTime() {
  return http.get('/api/getTime');
}

// 插入课题
export function insertTopic(params) {
  return http.post("/api/insertTopic", params);
}

//获取课题
export function getTopicList(params) {
  return http.post("/api/getTopicList", params);
}

//审核题目
export function auditTopic(params) {
  return http.post("/api/auditTopic", params);
}

//获取历史题目
export function getHistoryTopic() {
  return http.get('/api/getHistoryTopicList');
}


//获取学院
export function getFacultyList() {
  return http.post('/api/getFacultyList');
}

/** *=============================================== */
// 获取院系信息
export function getFacultyAll() {
  return http.get("/api/getFacultyAll");
}

// 添加院系
export function insertFaculty(params) {
  return http.post("/api/insertFaculty", params);
}

// 修改院系
export function updateFaculty(params) {
  return http.post("/api/updateFaculty", params);
}

// 删除院系
export function deleteFaculty(params) {
  return http.get("/api/deleteFaculty", params);
}

// 获取个人信息
export function getPersonInfo() {
  return http.get("/api/person");
}
