import request from '@/utils/request/request'
//查询专业列表
export function getMajor(departmentId) {
  return request({
    url: '/major/list' ,
    method: 'get',
    params: {
      departmentId: departmentId,
    }
  })
}
//查询专业
export function getMajorInfo(majorId) {
  return request({
    url: '/major/'+majorId ,
    method: 'get',
  })
}
//新增专业
export function addMajor(majorName, departmentId) {
  return request({
    url: '/major/add',
    method: 'post',
    data: {
      majorName: majorName,
      departmentId: departmentId,
    }
  })
}
//删除专业
export function deleteMajor(majorId) {
  return request({
    url: '/major/' + majorId,
    method: 'delete',

  })
}
//修改专业
export function changeMajor(majorName, majorId, departmentId) {
  return request({
    url: '/major/edit',
    method: 'post',
    data: {
      majorName: majorName,
      majorId: majorId,
      departmentId: departmentId,
    }
  })
}