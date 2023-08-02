import request from '@/utils/request/request'
//查询工作手册列表
export function checkWorkbook(departmentId) {
    return request({
        url: '/workbook/list',
        method: 'get',
        params:{
            departmentId:departmentId
        }
    })
}
// 获取工作手册详细信息
export function checkWorkbookInfo(workbookId) {
    return request({
        url: '/workbook/'+workbookId,
        method: 'get',     
    })
}
// 修改工作手册
export function editWorkbookInfo(Array) {
    return request({
        url: '/workbook',
        method: 'put', 
        data:Array,  
    })
}
//新建手册模板
export function newWorkbookInfo(name,departmentId) {
    return request({
        url: '/workbook',
        method: 'post',    
        data:{
            name:name,
            departmentId:departmentId,
        } 
    })
}
//删除手册模板
export function deleteWorkbook(workbookId) {
    return request({
        url: '/workbook/'+workbookId,
        method: 'delete',    
    })
}
// 为课程库课程分配工作手册模板
export function setWorkbook(Array) {
    return request({
      url: "/baseCourse/workbook/asssociate",
      method: "PUT",
      data: Array,
    });
  }