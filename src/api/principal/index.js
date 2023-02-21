import request from '@/utils/request/request'

//查询课程负责人的教学班列表
export function getPrincipalClassList() {
    return request({
      url: '/classes/respondent',
      method: 'get',
    })
  }
  //查询课程负责人的课程库列表
export function getPrincipalBasecourseList() {
    return request({
      url: '/baseCourse/respondent',
      method: 'get',
    })
  }