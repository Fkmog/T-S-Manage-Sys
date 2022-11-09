<template>
  <HeaderSearch></HeaderSearch>
  <div class="courseTable">
    <el-table
      :data="courseList"
      highlight-current-row
      stripe
      style="width: 680px; font-size: 18px; border-radius: 2px"
      :header-cell-style="{ fontSize: '18px' }"
      :row-style="{ height: '60px' }"
    >
      <el-table-column prop="name" label="课程名" width="180px" />
      <el-table-column prop="beginNum" label="开课号" width="300px" />
      <el-table-column prop="courseNum" label="课程号" width="200px" />
    </el-table>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";

import { Search } from "@element-plus/icons-vue";

export default {
  name: "BaseCourse",
  components: {
    Search,
    HeaderSearch,
  },
  data() {
    return {
      courseList: [
        {
          name: "计算机导论",
          beginNum: "(2017-2018-1)-A0401010-1",
          courseNum: "A0401010",
        },
        {
          name: "人工智能",
          beginNum: "(2017-2018-2)-A0401020-1",
          courseNum: "A0401020",
        },
        {
          name: "数据结构",
          beginNum: "(2017-2018-2)-A0401030-1",
          courseNum: "A0401030",
        },
      ],
    };
  },
};
</script>

<style scoped>
.courseTable {
  margin: 0 auto;
  width: 680px;
  margin-top: 30px;
  box-shadow: 0.4px 0.4px 1.1px rgba(0, 0, 0, 0.028),
    1.3px 1.3px 3.6px rgba(0, 0, 0, 0.042), 2px 6px 16px rgba(0, 0, 0, 0.07);
}
</style>