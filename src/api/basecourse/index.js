import request from '@/utils/request/request'
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
// 获取指标点列表
export function getIndicatorList(bcdmId) {
    return request({
        url: '/detailMajor/list ',
        method: 'get',
        params:{
            bcdmId:bcdmId
        }
    })
}
// 获取指标点下拉列表
export function getPullIndicator(programId) {
    return request({
        url: '/detailMajor/indicatorAll/'+programId,
        method: 'get',
    })
}
//获取课程目标
export function getObjectives(detailId) {
    return request({
        url: '/detail/'+detailId,
        method: 'get',
    })
}
//课程目标保存
export function saveObjectives(Array) {
    return request({
      url: '/detail',
      method: 'PUT',
      data:Array
    })
  }
  //指标点保存
  export function saveIndicators(Array) {
    return request({
      url: '/detailMajor',
      method: 'PUT',
      data:Array
    })
  }
