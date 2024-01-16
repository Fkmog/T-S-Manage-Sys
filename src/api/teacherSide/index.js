import request from "@/utils/request/request";
//查询该教师的课程
export function checkClasses(
  schoolId,
  departmentId,
  keyword,
  academicYear,
  semester,
  status
) {
  return request({
    url: "/classes/teacher",
    method: "get",
    params: {
      schoolId: schoolId,
      departmentId: departmentId,
      selectKeyWord: keyword,
      academicYear,
      semester,
      status,
    },
  });
}
