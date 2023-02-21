<template>
  <HeaderSearch></HeaderSearch>
  <div class="content">
    <!-- <div class="basecourses"
    :data="basecourseTable"
    
    >

    </div> -->
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import {
  getPrincipalBasecourseList,
} from "@/api/principal";

export default {
  name: "PrincipalBaseCourse",
  components: { HeaderSearch },
  data() {
    return {
      basecourseTable: [],
    };
  },
  mounted() {
    this.getBasecourseList()
  },
  methods: {
    getBasecourseList() {
      getPrincipalBasecourseList().then((res)=>{
        console.log("getBasecourseList",res);
      });
    },
  },
};
</script>

<style scoped>
.content {
  margin-top: 55px;
}
</style>