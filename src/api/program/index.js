import request from '@/utils/request/request'
//查询培养计划
export function checkProgram(majorId, enrollyear) {
    return request({
        url: '/program/' + majorId + '/' + enrollyear,
        method: 'get',
    })
}
//新增培养计划
export function addProgram(majorId,departmentId,schoolId, enrollyear) {
    return request({
        url: '/program/add',
        method: 'POST',
        data:{
            majorId:majorId,
            departmentId:departmentId,
            schoolId:schoolId,
            enrollyear:enrollyear,
        }
    })
}
