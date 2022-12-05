import request from '@/utils/request/request'
//查询用户信息
export function getUserInfo() {
    return request({
      url: '/getInfo',
      method: 'get'
    })
  }