import request from '@/utils/request/request'
//查询培养方案 by majorId+enrollyear
export function checkProgram(majorId, enrollyear) {
    return request({
        url: '/program/' + majorId + '/' + enrollyear,
        method: 'get',
    })
}
//查询培养方案 by programId
export function checkProgramByProgramId(programId) {
    return request({
        url: '/program/' +programId ,
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
//修改培养方案
export function editProgram(Array) {
    return request({
        url: '/program/edit',
        method: 'POST',
        data:Array
    })
}
