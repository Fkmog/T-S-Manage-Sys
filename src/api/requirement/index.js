import request from '@/utils/request/request'
//查询毕业要求
export function checkRequirement(programId) {
    return request({
        url: '/requirement/program/' +programId ,
        method: 'get',
    })
}
//修改毕业要求
export function changeRequirement(Array) {
    return request({
        url: '/requirement/batchRequirements',
        method: 'post',
        data:Array
    })
}
