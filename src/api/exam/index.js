import request from "@/utils/request/request";
// 查询试卷分析列表
export function getExamList(detailId, schoolId, departmentId) {
  return request({
    url: "/analysis/list",
    method: "get",
    params: {
      detailId,
      schoolId,
      departmentId,
    },
  });
}

//查看试卷分析
export function getExamAnalysis(classId) {
  return request({
    url: "/analysis/editAverageScore/" + classId,
    method: "get",
  });
}

export function editExamAnalysis(dict) {
  return request({
    url: "/analysis/editAverageScore",
    method: "POST",
    data: dict,
  });
}
// 删除试卷分析
export function deleteExam(array) {
  return request({
    url: "/analysis",
    method: "DELETE",
    data: array,
  });
}
// 修改
export function editExam(array) {
  return request({
    url: "/analysis",
    method: "PUT",
    data: array,
  });
}
