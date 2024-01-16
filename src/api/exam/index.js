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
}import request from "@/utils/request/request";


//查看试卷分析
export function getExamAnalysis(classId) {
    return request({
      url: "/analysis/editAverageScore/"+classId,
      method: "get",
    });
  }

  export function editExamAnalysis(dict){
    return request({
        url:"/analysis/editAverageScore",
        method:'POST',
        data:dict
    })
  }