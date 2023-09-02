import request from '@/utils/request/request'
//通用下载
export function downloadFile(fileAddress) {
    return request({
      url: '/common/download/file',
      method: 'get',
      params:{
        fileAddress,
      }
    })
  }