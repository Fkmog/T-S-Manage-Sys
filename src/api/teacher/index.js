import request from '@/utils/request/request'
//远程模糊搜索教师
export function checkTeachers(departmentId,schoolId,instructor) {
    return request({
        url: '/teacher/list/instructor' ,
        method: 'get',
        params:{
            instructor:instructor,
            departmentId:departmentId,
            schoolId:schoolId
        }
    })
}

