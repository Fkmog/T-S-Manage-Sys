// 抽屉顶部搜索栏
<template>
  <div class="bar">
    <div class="searchBlock">
      <el-icon class="iconSearch" size="24px" color="rgb(137, 137, 137)">
        <Search />
      </el-icon>
      <div class="searchLine">
        <el-input
          class="searchInput"
          :class="active ? 'activeInput' : ''"
          v-model="searchInput"
          :placeholder="msg"
          @change="sendMessage"
          @focus="active = true"
          @blur="inputBlur()"
          clearable
          @clear="clearInput()"
        />
      </div>
    </div>
    <!-- 右侧版本选择插槽 -->
    <slot name="version" class="rightSlot"></slot>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "DrawerSearch",
  props: {
    msg: String,
  },
  components: {
    Search,
  },
  data() {
    return {
      searchInput: "",
      active: false,
    };
  },
  methods: {
    sendMessage() {
      this.$emit("SearchValue", this.searchInput);
    },
    inputBlur() {
      if (this.searchInput === "") {
        this.active = false;
      } else {
        this.active = true;
      }
    },
    clearInput() {
      this.searchInput = "";
      this.inputBlur();
    },
  },
};
</script>

<style scoped>
.searchInput {
    margin-top: -5px;;
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
  width: 300px;
  display: flex;
  flex-direction: row;
}
.searchBlock {
  width: 300px;
  display: flex;
  flex-direction: row;
}
.activeInput {
  width: 200px;
  transition: all 0.3s;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 1;
  transition: 0.3s;
}
.searchBlock:hover .searchInput {
  width: 200px;
  transition: all 0.3s;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 1;
  transition: 0.3s;
}
.searchInput:focus {
  width: 200px;
  outline: 0;
}
.searchInput >>> .el-input__wrapper {
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid #d5d5d5;
  box-shadow: 0 0 0 0px;
  background-color: inherit;
}
</style>
