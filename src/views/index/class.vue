<template>
  <HeaderSearch></HeaderSearch>


<div class="classTable">
    <el-table
      :data="classList"
      highlight-current-row
      stripe
      style="width: 630px; font-size: 18px; border-radius: 2px"
      :header-cell-style="{ fontSize: '18px' }"
      :row-style="{ height: '60px' }"
    >
    <!-- 都要改 prop label -->
    <!-- 这里修改width，一共需要改三个width -->
      <el-table-column prop="beginNum" label="班级号" width="250px" />
      <el-table-column prop="name" label="班级人数" width="180px" />
      <el-table-column prop="courseNum" label="课程号" width="200px" />
    </el-table>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";

export default {
  name: "Class",
  components: {
    HeaderSearch,
  },
  data() {
    return {
      classList: [
        {
          name: "120人",
          beginNum: "(2017-2018-1)-1",
          courseNum: "A0401010",
        },
        {
          name: "60人",
          beginNum: "(2017-2018-2)-1",
          courseNum: "A0401020",
        },
        {
          name: "60人",
          beginNum: "(2017-2018-2)-1",
          courseNum: "A0401030",
        },
      ],
    };
  },
};
</script>

<style scoped>
.classTable {
  margin: 0 auto;
  width: 630px;
  margin-top: 30px;
  box-shadow: 0.4px 0.4px 1.1px rgba(0, 0, 0, 0.028),
    1.3px 1.3px 3.6px rgba(0, 0, 0, 0.042), 2px 6px 16px rgba(0, 0, 0, 0.07);
}

</style>