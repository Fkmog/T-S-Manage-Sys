import request from '@/utils/request/request'
//查询教学班列表
export function getClass(academicYear,semester,departmentId,pageSize,pageNum) {
    return request({
      url: '/classes/list',
      method: 'get',
      params:{
        academicYear:academicYear,
        semester:semester,
        departmentId:departmentId,
        pageSize:pageSize,
        pageNum:pageNum,
      }
    })
  }
 //添加教学班列表
 export function addClass(academicYear,semester,departmentId,className,identifier,teacherName,teacherNumber,courseCode,remark,schoolId) {
  return request({
    url: '/classes/add',
    method: 'POST',
    data:{
      academicYear:academicYear,
      semester:semester,
      departmentId:departmentId,
      // 课程名
      className:className,
      // 开课号
      identifier:identifier,
      // 任课教师
      teacherName:teacherName,
      teacherNumber:teacherNumber,
      // 课程号
      courseCode:courseCode,
      remark:remark,
      schoolId:schoolId,
    }
  })
}
  //修改教学班信息
  export function editClass(array) {
    return request({
      url: '/classes/edit',
      method: 'POST',
      data:array,
    })
}
//课程负责人给予老师修改课程目标权限
export function setPermission(array) {
  return request({
    url: '/classes/setClassIsRespondent',
    method: 'POST',
    data:array,
  })
}