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
export function getIndicatorList(majorName,enrollYear) {
  return request({
    url: "/detailProgram/list ",
    method: "get",
    params: {
      majorName: majorName,
      enrollYear:enrollYear
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
// 上传课程大纲
export function upload(Array) {
  return request({
    url: "/common/upload/file",
    method: "POST",
    data: Array,
  });
}
//下载课程大纲
export function downloadDetail(detailId) {
  return request({
    url: "/detail/download/syllabusFile/"+detailId,
    method: "GET",
    responseType: 'blob',
  });
}
// 查询课程大纲文件列表
export function getFilesList(detailId) {
  return request({
    url: "/detail/getFile/"+ detailId,
    method: "GET",
  });
}

//查询已有成绩项,课程目标的课程
export function getEditDetail(selectKeyWord,versionId,pageSize,pageNum) {
  return request({
    url: "/detail/select",
    method: "get",
    params: {
      selectKeyWord: selectKeyWord,
      versionId:versionId,
      pageSize:pageSize,
      pageNum:pageNum,
    },
  });
}
//查询版本信息
export function getVersion() {
  return request({
    url: "/detail/versionList",
    method: "get",
  });
}
//复制成绩项,课程目标
export function copyActAndObj(Array) {
  return request({
    url: "/detail/copy",
    method: "PUT",
    data: Array,
  });
}
//查询培养方案课程列表
export function getProgramCourseList(programId) {
  return request({
    url: "/baseCourse/program/"+programId,
    method: "get",
  });
}
//复制指标点
export function copyIndicator(Array) {
  return request({
    url: "/detailProgram/copy",
    method: "PUT",
    data: Array,
  });
}
//复制毕业要求，达成度，课程体系
export function copyProgram(Array) {
  return request({
    url: "/program/copy",
    method: "PUT",
    data: Array,
  });
}
//提交考试分析表
export function submitPaperAnalysis(dict) {
  return request({
    url: "/analysis",
    method: "POST",
    data: dict,
  });
}
//修改考试分析表
export function editPaperAnalysis(dict) {
  return request({
    url: "/analysis",
    method: "PUT",
    data: dict,
  });
}
//删除考试分析表
export function deletePaperAnalysis(array) {
  return request({
    url: "/analysis",
    method: "DELETE",
    data: array,
  });
}
//获取所有考试分析表
export function getPaperAnalysisList(detailId) {
  return request({
    url: "/analysis/list/?detailId="+detailId,
    method: "get",
    
  });
}
//获取详细考试分析表
export function getDetailedPaperAnalysis(paperAnalysisId) {
  return request({
    url: "/analysis/"+paperAnalysisId,
    method: "get",
  });
}
