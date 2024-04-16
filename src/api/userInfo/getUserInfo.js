import request from '@/utils/request/request'
//查询用户信息
export function getUserInfo() {
    return request({
      url: '/getInfo',
      method: 'get'
    })
  }
// 用户修改密码
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}
