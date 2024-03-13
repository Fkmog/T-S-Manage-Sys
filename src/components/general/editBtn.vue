// 右侧编辑按钮
<template>
  <div class="editBtnBlock">
    <el-button
      class="editBtn"
      color="#626aef"
      plain
      type="primary"
      ><el-icon><EditPen /></el-icon>
      </el-button
    >

  </div>
</template>

<script>
import {  EditPen } from "@element-plus/icons-vue";

export default {
  name: "editBtn",
  components: {
      EditPen
  },
};
</script>

<style scoped>
.editBtnBlock {
  position: absolute;
  top: 80px;
  right: 80px;
  z-index: 10;
}
.editBtn {
  margin-right: 10px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  min-height: 60px;
  min-width: 60px;
  line-height: 40px;
  background: #2196f3;
  color: white;
  transition: all 0.3s;
  font-size: 25px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
}
.editBtn:hover {
  margin-right: 8px;
  margin-top: 8px;
  width: 65px;
  height: 65px;
  background: #2962ff;
  font-size: 30px;
  transition: all 0.3s;
}
</style>