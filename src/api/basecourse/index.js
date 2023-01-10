import request from '@/utils/request/request'
//   //添加教学班列表
// export function addClass(remark) {
//   return request({
//     url: '/classes/add',
//     method: 'POST',
//     data:{

//       remark:remark,
//     }
//   })
// }
// 查询毕业要求指标点
export function getIndicators(bcdmId, departmentId, schoolId,programId) {
    return request({
        url: '/detailMajor/courseIndicator',
        method: 'get',
        params: {
            bcdmId: bcdmId,
            departmentId: departmentId,
            schoolId: schoolId,
            programId: programId,
        }
    })
}
// 通过detailId查询对应的majors以及bcdmId
export function getMajors(detailId) {
    return request({
        url: '/detailMajor/list' + '?detailId=' + detailId,
        method: 'get',
    })
}
//通过bcdmId获得培养计划课程专业详情
export function getDetailMajor(bcdmId) {
    return request({
        url: '/detailMajor/ '+ bcdmId,
        method: 'get',
    })
}