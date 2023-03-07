import request from "@/utils/request/request";
// 查询毕业要求指标点
export function getIndicators(bcdmId, departmentId, schoolId, programId) {
  return request({
    url: "/detailProgram/courseIndicator",
    method: "get",
    params: {
      bcdmId: bcdmId,
      departmentId: departmentId,
      schoolId: schoolId,
      programId: programId,
    },
  });
}
// 通过detailId查询对应的majors以及bcdmId
export function getMajorsProgram(detailId, departmentId, schoolId) {
  return request({
    url: "/detailProgram/listProgram",
    method: "get",
    params: {
      detailId: detailId,
      departmentId: departmentId,
      schoolId: schoolId,
    },
  });
}
//通过bcdmId获得培养计划课程专业详情
export function getDetailMajor(bcdmId) {
  return request({
    url: "/detailProgram/ " + bcdmId,
    method: "get",
  });
}
// 获取指标点列表
export function getIndicatorList(bcdmId) {
  return request({
    url: "/detailProgram/list ",
    method: "get",
    params: {
      bcdmId: bcdmId,
    },
  });
}
// 获取指标点下拉列表
export function getPullIndicator(programId) {
  return request({
    url: "/detailProgram/indicatorAll/" + programId,
    method: "get",
  });
}
//获取课程目标
export function getObjectives(detailId) {
  return request({
    url: "/detail/" + detailId,
    method: "get",
  });
}
//课程目标保存
export function saveObjectives(Array) {
  return request({
    url: "/detail",
    method: "PUT",
    data: Array,
  });
}
//指标点保存
export function saveIndicators(Array) {
  return request({
    url: "/detailProgram",
    method: "PUT",
    data: Array,
  });
}
//通过courseId获取detailId列表
export function getDetails(courseId, departmentId, schoolId) {
  return request({
    url: "/detail/list",
    method: "get",
    params: {
      courseId: courseId,
      departmentId: departmentId,
      schoolId: schoolId,
    },
  });
}
//分配课程大纲
export function assign(Array) {
  return request({
    url: "/classes/setDetail",
    method: "POST",
    data: Array,
  });
}
