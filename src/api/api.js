import http from "@/axios/http";
import {useState} from "react";

//  登陆
export function Login(params) {
  return http.post("/api/login", params);
}

//修改密码
export function changePwd(params) {
  return http.post('/api/changePwd', params);
}

//注册
export function register(params){
  return http.post('/api/register', params);
}

//批量导入
export function importPersons(params){
  return http.post('/api/importPersons', params);
}

//删除用户
export function deleteUser(params) {
  return http.post('/api/deleteUser', params);
}

//获取分页头像
export function getPictureList(params) {
  return http.post('/api/getPictureList', params);
}

//修改头像
export function setPicture(params) {
  return http.post('/api/setPicture', params);
}

//添加头像
export function insertPicture(params) {
  return http.post('/api/insertPicture', params);
}

// 验证账号
export function Verify(params) {
  return http.get("/api/verify", params);
}

//获取person 集合
export function getPersonList(params) {
  return http.post('/api/getPersonList', params)
}

// 获取个人信息
export function getPersonInfo() {
  return http.get("/api/person");
}

//修改person
export function updateUser(params) {
  return http.post("/api/updateUser", params);
}

//获取时间
export function getTime() {
  return http.get("/api/getTime");
}

//修改时间
export function updateTimeById(params){
  return http.post('/api/updateTimeById', params)
}

// 插入课题
export function insertTopic(params) {
  return http.post("/api/insertTopic", params);
}

//修改题目  
export function updateTopic(params) {
  return http.post('/api/updateTopic', params)
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
export function getHistoryTopic(params) {
  return http.get("/api/getHistoryTopicList", params);
}

//删除题目
export function deleteTopic(params) {
  return http.post("/api/deleteTopic", params);
}

//获取学院
export function getFacultyList() {
  return http.post("/api/getFacultyList");
}


//选题
export function selectTopic(params) {
  return http.post("/api/select", params);
}

//查询选题
export function searchTopic(params) {
  return http.post("/api/searchTopic", params);
}

//教师审核
export function teacherAudit(params) {
  return http.post("/api/teacherAudit", params);
}


//获取jvm信息
export function getJvmInfo() {
  return http.get('/actuator/metrics/jvm.memory.max');
}

//获取照片
export function getImage(params) {
  return http.get('/api/getImage', params)
}

/** *=============================================== */
// 获取院系信息
export function getFacultyAll() {
  return http.post("/api/getFacultyAll");
}


export function getCascader() {
  return http.post("/api/getCascader");
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
  return http.post("/api/deleteFaculty", params);
}


//查询进度
export function getReportList(params) {
  return http.get('/api/getReportList', params);
}


//删除文件
export function deleteReport(params) {
  return http.post('/api/deleteReport', params);
}

//下载文件
export function getReport(params) {
  return http.get('/api/getReportFile', params);
}

//获取成绩
export function getTopicGrade(params) {
  return http.get('/api/getTopicGrade', params);
}

//修改成绩
export function insertGrade(params) {
  return http.post('/api/insertGrade', params);
}

//一次性获取 题目信息和成绩
export function getSelectTopicInfo(params) {
  return http.get('/api/getSelectTopicInfo', params)
}

//上传文件
export function uploadReport(params) {
  return http.post('/api/uploadReport', params)
}


//成绩比例 修改
export function updateScore(params) {
  return http.post('/api/updateScore', params)
}

//成绩比例 获取
export function getScore() {
  return http.get('/api/getScore')
}
