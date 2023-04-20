// 顶部搜索栏
<template>
  <div class="Block">
    <div class="bar">
      <div class="searchBlock">
        <el-icon class="iconSearch" size="24px" color="rgb(137, 137, 137)">
          <Search />
        </el-icon>
        <div class="searchLine">
          <input
            class="searchInput"
            :class="active ? 'activeInput' : ''"
            v-model="searchInput"
            :placeholder = "msg"
            @change="sendMessage"
            @focus="active = true"
            @blur="active = false"
          />
        </div>
      </div>
      <!-- 右侧时间选择插槽 -->
      <slot name="rightTime" class="rightSlot"></slot>
      <slot name="assignBtn" class="assignBtn"></slot>
    </div>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "HeaderSearch",
  props: {
      msg: String,
      required: true
    },
  components: {
    Search,
  },
  data() {
    return {
      searchInput: "",
      // isActive:true,
      active: false,
    };
  },
  methods: {
    sendMessage() {
     
    },
  },

};
</script>

<style scoped>
.Block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.iconSearch {
  margin-top: 18px;
  margin-left: 50px;
}
.searchInput {
  margin-top: 17px;
  margin-left: 5px;
  font-size: 16px;
  width: 0px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 0;
  background: rgba(0, 0, 0, 0);
}
.bar {
  width: 400px;
  display: flex;
  flex-direction: row;
}
.searchBlock {
  width: 400px;
  display: flex;
  flex-direction: row;
}
.activeInput {
  width: 220px;
  transition: all 0.3s;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 1;
  transition: 0.3s;
  margin-top:20px;

}
.searchBlock:hover .searchInput {
  margin-top:20px;
  width: 220px;
  transition: all 0.3s;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 1;
  transition: 0.3s;
}
.searchInput:focus {
  width: 220px;
  outline: 0;
}
</style>
