<template>
  <el-table :data="classTable">
    <el-table-column prop="1" label="课程名" width="200" />
    <el-table-column prop="2" label="任课教师" width="150" />
  </el-table>
</template>

<script>
export default {
  name: "NewUp",
  components: {},
  data() {
    return {
      classesTable: [
        {
          1: a,
          2: a,
        },
        {
          1: b,
          2: b,
        },
      ],
    };
  },
};
</script>

<style scoped></style>
