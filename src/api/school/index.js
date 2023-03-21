import request from '@/utils/request/request'
//查询学校列表
export function getSchool() {
  return request({
    url: '/school/list' ,
    method: 'get',
  })
}

