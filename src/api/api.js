import http from '@/axios/http';

//  登陆
export function Login(params) {
    return http.post('/api/login', params);
}

// 验证账号
export function Verify(params) {
    return http.get('/api/verify', params);
}

//获取课程信息接口
export function getCourseByUser() {
    return http.get('/api/getCourseByUser');
}

//选择课程
export function selectCourse(params) {
    return http.post('/api/select', params);
}

//获取历史选课信息
export function getHistoryCourse(params) {
    return http.post('/api/getHistoryCourse',
        {
            type: params
        })
}

//退订当前课程
export function unsubscribe() {
    return http.post('/api/unsubscribe');
}

//查看成绩
export function getGrade(params) {
    return http.post('/api/getGrade',
        {
            id: params
        })
}

//添加课程
export function addCourse(params) {
    return http.post('/api/addCourse', params);
}

//管理员获取历史课程
export function getHistCouAdmin(params) {
    return http.post('/api/getHistoryCourse', params);
}


//获取院系信息
export function getFacultyAll() {
    return http.get('/api/getFacultyAll');
}

//添加院系
export function insertFaculty(params) {
    return http.post('/api/insertFaculty', params);
}

//修改院系
export function updateFaculty(params) {
    return http.post('/api/updateFaculty', params);
}

//删除院系
export function deleteFaculty(params) {
    return http.get('/api/deleteFaculty', params)
}
