import request from '@/utils/request/request'

export function login(username,password) {
    return request({
      url: '/login',
      method: 'post',
      data:{
          username,
          password
      }
    })
  }