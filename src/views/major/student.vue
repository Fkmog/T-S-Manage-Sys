<template>
  <div v-show="hasProgram">
    <div v-show="hasStudent">

        <div layout="row" flex class="md-padding">
          <addBtn @click="goAddStudent"></addBtn>
          <!-- 学生信息列表 -->
          <el-table
          class="studentsTable"
          :data="studentsTable"
          style="width: 40%"
          :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'48px','font-weight': 'bold','color':'black'}"
          :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
          highlight-current-row
        >
          <el-table-column prop="studentId" label="学号"  width="200px"/>
          <el-table-column prop="studentName" label="姓名" />
        </el-table>
      </div>
    </div>
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

import request from "@/utils/request/request";
import addBtn from "@/components/general/addBtn.vue";
export default {
  name: "Student",
  components: {
    request,addBtn
  },
  methods:{
    goAddStudent(){
      console.log('go add student');
      this.$router.push("/baseAddStudent");
    },
    async checkProgram(){
    if(this.$store.state.major.programId){
      this.hasProgram = true;
    }
    else{
      this.hasProgram = false;
    }
  },
  getStudents(){
      return request({
        url:'/student/listByProgram'+'/'+this.programId,
        method:'get'
      }).then(function(res){
        console.log('student:',res);
      })
    }
  },
  data(){
    return{
      //是否有培养方案
    hasProgram:Boolean,
    //学生是否为空
    hasStudent:Boolean,

    programId:'',
    studentsTable:[{
        studentId:222050200,
        studentName:'张三',
      },
      {
        studentId:222050211,
        studentName:'李四',
      }]
    }
  },
  mounted:function(){
    this.programId = this.$store.state.major.programId;
    this.getStudents();
    this.checkProgram();
  }
};
</script>

<style scoped>
.studentsTable{
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.md-padding {
  margin-top: 120px;
}
.no-program {
  display: flex;
  flex-direction: column;
}
</style>