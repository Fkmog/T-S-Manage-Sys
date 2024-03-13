import request from "@/utils/request/request";
//查询工作手册列表
export function checkWorkbook(departmentId) {
  return request({
    url: "/workbook/list",
    method: "get",
    params: {
      departmentId: departmentId,
    },
  });
}
// 获取工作手册详细信息
export function checkWorkbookInfo(workbookId) {
  return request({
    url: "/workbook/" + workbookId,
    method: "get",
  });
}
// 修改工作手册
export function editWorkbookInfo(Array) {
  return request({
    url: "/workbook",
    method: "put",
    data: Array,
  });
}
//新建手册模板
export function newWorkbookInfo(name, departmentId) {
  return request({
    url: "/workbook",
    method: "post",
    data: {
      name: name,
      departmentId: departmentId,
    },
  });
}
//删除手册模板
export function deleteWorkbook(workbookId) {
  return request({
    url: "/workbook/" + workbookId,
    method: "delete",
  });
}
// 为课程库课程分配工作手册模板
export function setWorkbook(Array) {
  return request({
    url: "/baseCourse/workbook/associate",
    method: "PUT",
    data: Array,
  });
}
// 根据classId查询工作手册
export function WorkbookByClass(classId) {
  return request({
    url: "/workbook/class/" + classId,
    method: "get",
  });
}
// 根据courseId查询工作手册
export function WorkbookByCourseId(courseId) {
  return request({
    url: "/workbook/baseCourse/" + courseId,
    method: "get",
  });
}
// 教师填写工作手册
export function editByTeacher(classId,workbookJson) {
    return request({
      url: "/classes/editWorkbook" ,
      method: "post",
      data:{
        classId:classId,
        workbookJson:workbookJson
      }
    });
  }
  // 预设工作手册
export function present(detailId,formPreset,courseId) {
  return request({
    url: "/workbook/preset" ,
    method: "post",
    data:{
      detailId:detailId,
      formPreset:formPreset,
      courseId:courseId
    }
  });
}
  // 查看预设内容
  export function getPresent(detailId) {
    return request({
      url: "/workbook/preset/"+detailId,
      method: "get",
    
    });
  }