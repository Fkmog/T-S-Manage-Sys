<template>
  <div v-show="hasProgram">
    <div v-show="hasStudent"></div>
    <div v-show="!hasStudent" class="no-program">
      <h2 style="display: flex; justify-content: center; margin-top: 100px">
      没有学生
    </h2>
    <div style="display: flex; justify-content: center; color: grey">
        请先点击右上角圆形按钮添加学生
      </div>
    </div>
  </div>
  <div v-show="!hasProgram" class="no-program">
    <h2 style="display: flex; justify-content: center; margin-top: 100px">
      未创建培养方案
    </h2>
    <div style="display: flex; justify-content: center; color: grey">
        请先创建培养方案
      </div>
  </div>
</template>

<script>
export default {
  name: "Student",
  methods:{
    async checkProgram(){
    if(this.$store.state.major.programId){
      this.hasProgram = true;
    }
    else{
      this.hasProgram = false;
    }
  },
  },
  data(){
    return{
      //是否有培养方案
    hasProgram:Boolean,
    //学生是否为空
    hasStudent:Boolean,
    }
  },
  mounted:function(){
    this.checkProgram();
  }
};
</script>

<style scoped>
.no-program {
  display: flex;
  flex-direction: column;
}
</style>