// 右侧添加按钮
<template>
  <div class="addBtnBlock">
    <el-button
      class="addBtn"
      color="#626aef"
      plain
      type="primary"
      >+
      <!-- <el-icon>
        <Plus />
      </el-icon> -->
      </el-button
    >
    <!-- <button class="addBtn" >
       </button> -->
  </div>
</template>

<script>
import { Plus } from "@element-plus/icons-vue";

export default {
  name: "addBtn",
  components: {
    Plus,
  },
};
</script>

<style scoped>
.addBtnBlock {
  position: absolute;
  top: 130px;
  right: 80px;
  z-index: 10;
}
.addBtn {
  margin-right: 10px;
  margin-top: 10px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  min-height: 60px;
  min-width: 60px;
  line-height: 40px;
  background: #a2a9d3;
  color: white;
  transition: all 0.3s;
  font-size: 25px;
}
.addBtn:hover {
  margin-right: 8px;
  margin-top: 8px;
  width: 65px;
  height: 65px;
  background: #6573c0;
  font-size: 30px;
  transition: all 0.3s;
}
</style>