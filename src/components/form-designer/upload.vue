<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :action="action"
    multiple
    :headers="headers"
    :limit="limit"
    :data='data'
    accept='.doc,.docx,.pdf,.rar,.zip'
    showFileList
    list-type='text' 
  >
    <el-button type="primary">点击上传</el-button>
  </el-upload>
</template>

<script>
export default {
  name: "upload",
  components: {},
  data() {
    return {
      fileList: [],
      limit: 1,
      action:'http://81.68.103.96:8099/common/upload/files',
      headers:{},
      data:{}
    };
  },
};
</script>

<style scoped></style>
