import request from '@/utils/request/request'
//查询数据字典
export function getDictionary() {
    return request({
      url: 'system/dict/data/school/type',
      method: 'get',
    })
  }