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
      action:'http://81.68.103.96:8099/common/upload/file',
      headers:{},
      data:{}
    };
  },
};
</script>

<style scoped></style>
