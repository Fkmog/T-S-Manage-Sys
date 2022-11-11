import request from '@/utils/request/request'
//查询专业列表
export function getMajor() {
  return request({
    url: '/major/list',
    method: 'get'
  })
}
//新增专业
export function addMajor(majorName) {
  return request({
    url: '/major/add',
    method: 'post',
    data: {
      majorName: majorName,
    }
  })
}
//删除专业
export function deleteMajor(majorId) {
  return request({
    url: '/major/delete/' + majorId,
    method: 'post'
  })
}
//修改专业
export function changeMajor(majorName,majorId) {
  return request({
    url: '/major/edit',
    method: 'post',
    data: {
      majorName: majorName,
      majorId:majorId
    }
  })
}