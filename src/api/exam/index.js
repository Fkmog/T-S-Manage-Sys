import request from "@/utils/request/request";
// 查询试卷分析列表
export function getExamList(detailId,schoolId,departmentId) {
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