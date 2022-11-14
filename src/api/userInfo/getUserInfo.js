import request from '@/utils/request/request'

export function getUserInfo() {
    return request({
      url: '/getInfo',
      method: 'get'
    })
  }