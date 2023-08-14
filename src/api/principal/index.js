import request from "@/utils/request/request";

//查询课程负责人的教学班列表
export function getPrincipalClassList(academicYear, semester,pageSize,pageNum,status) {
  return request({
    url: "/classes/respondent",
    method: "get",
    params: {
      academicYear: academicYear,
      semester: semester,
      pageSize:pageSize,
      pageNum:pageNum,
      status:status
    },
  });
}
//查询课程负责人的课程库列表
export function getPrincipalBasecourseList() {
  return request({
    url: "/baseCourse/respondent",
    method: "get",
  });
}
