import request from "@/utils/request/request";
//通用下载-by 文件地址
export function downloadFile(fileAddress) {
  return request({
    url: "/common/download/file",
    method: "get",
    params: {
      fileAddress,
    },
    responseType: 'blob',
  });
} 
//通用下载-by 文件id
export function downloadFileId(fileId) {
  return request({
    url: "/common/download/file/"+fileId,
    method: "get",
    responseType: 'blob',
  });
}
//通用删除-by 文件id
export function removeFileId(fileId) {
  return request({
    url: "/common/remove/file/"+fileId,
    method: "delete",
 
  });
}
