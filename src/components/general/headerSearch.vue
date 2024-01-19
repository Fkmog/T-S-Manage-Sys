// 顶部搜索栏
<template>
  <div class="Block">
    <div class="bar">
      <div class="searchBlock">
        <el-icon class="iconSearch" size="24px" color="rgb(137, 137, 137)">
          <Search />
        </el-icon>
        <div class="searchLine">
          <el-input
            ref="searchInput"
            class="searchInput"
            :class="active ? 'activeInput' : ''"
            v-model="keyword"
            :placeholder="msg"
            @change="sendMessage"
            @focus="active = true"
            @blur="inputBlur()"
            clearable
            @clear="clearInput()"
            @keyup.enter="sendMessage"
          />
        </div>
      </div>
      <!-- 右侧时间选择插槽 -->
      <slot name="rightTime" class="rightSlot"></slot>
      <!-- 右侧分配插槽 -->
      <slot name="assignBtn" class="assignBtn"></slot>
      <!-- 右侧状态选择插槽 -->
      <slot name="status" class="status"></slot>
    </div>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "HeaderSearch",
  props: {
    msg: String,
    value: {
      type: String,
      default: "",
    },
  },
  components: {
    Search,
  },
  data() {
    return {
      keyword: this.value,
      active: false,
    };
  },
  watch: {
    keyword(newVal) {
      // 监听搜索关键词的变化，并将其传递给父组件
      this.$emit("SearchValue", newVal);
    },
    value(newVal) {
      // 监听父组件传递的搜索关键词的变化
      this.keyword = newVal;
      if (this.keyword !== "") {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
  },
  mounted() {
    console.log(this.keyword, this.keyword === "");
    if (this.keyword !== "") {
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    }
  },
  methods: {
    sendMessage() {
      this.$emit("SearchValue", this.keyword);
    },
    inputBlur() {
      if (this.keyword === "") {
        this.active = false;
      } else {
        this.active = true;
      }
    },
    clearInput() {
      this.keyword = "";
      this.inputBlur();
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
  margin-top: 13px;
  /* font-size: 16px; */
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
  width: 370px;
  transition: all 0.3s;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  opacity: 1;
  transition: 0.3s;
}
.searchBlock:hover .searchInput {
  width: 370px;
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
.searchInput >>> .el-input__wrapper {
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid #d5d5d5;
  box-shadow: 0 0 0 0px;
  background-color: inherit;
}


</style>
