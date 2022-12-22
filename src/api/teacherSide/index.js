import request from '@/utils/request/request'
//查询该教师的课程
export function checkClasses(schoolId,departmentId) {
    return request({
        url: '/classes/teacher',
        method: 'get',
        params:{
            schoolId:schoolId,
            departmentId:departmentId
        }
    })
}
