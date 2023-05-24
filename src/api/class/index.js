import request from '@/utils/request/request'
//查询教学班列表
export function getClass(academicYear,semester,departmentId,schoolId,pageSize,pageNum,KeyWord) {
    return request({
      url: '/classes/list',
      method: 'get',
      params:{
        academicYear:academicYear,
        semester:semester,
        departmentId:departmentId,
        schoolId:schoolId,
        pageSize:pageSize,
        pageNum:pageNum,
        selectKeyWord:KeyWord,
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
//删除教学班
export function deleteClass(classId) {
  return request({
    url: '/classes/'+classId,
    method: 'DELETE',
  })
}
//查询教学班信息
export function getClassInfo(classId) {
  return request({
    url: '/classes/'+classId,
    method: 'GET',
  })
}
//关联课程库课程
export function associateCourses(array) {
  return request({
    url: '/dev-api/classes/associateCourse',
    method: 'POST',
    data:array,
  })
}