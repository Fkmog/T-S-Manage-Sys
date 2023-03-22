<template>
  <!-- 顶部导航栏 -->
  <div class="block">
    <el-row class="block-row">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="返回"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 50px"
          @click="backClass()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">{{ classInfo.className }}</div>
      <el-divider class="divider" direction="vertical" />
    </el-row>
  </div>


  <div layout="row" flex class="md-padding" >
    <addBtn @click="goAddScore"></addBtn>
<!-- 学生信息列表 -->
    <el-table
    class="studentsTable"
    :data="studentsTable"
    style="width: 80%"
    :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'48px','font-weight': 'bold','color':'black'}"
    :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
    v-show="hasScores"
  >
    <el-table-column prop="studentNumber" label="学号"  width="180px"/>
    <el-table-column prop="studentName" label="姓名" width="100px"/>
    <el-table-column  >
      <template #header>
        <span>成绩</span>
      </template>
      <template #default="scope">
        <el-row>
          <el-col v-for="(item,i) in activityName" :key="item.name" :span="4">
          {{ item }}
          <!-- <el-row>({{ activityScores[i] }})</el-row> -->
          <el-row>{{ scope.row.scores[i]}}/{{ activityScores[i]  }}</el-row>
        </el-col>
        </el-row>
        
        
       
        
      </template>
    </el-table-column>
    
  </el-table>
  <div v-show="!hasScores" class="no-program">
      <h2 style="display: flex; justify-content: center; margin-top: 100px">
        未添加成绩项
      </h2>
      
  </div>
  </div>
  
</template>

<script>
import { Back } from "@element-plus/icons-vue";
import addBtn from "@/components/general/addBtn.vue";
import request from "@/utils/request/request";
export default {
  name: "Score",
  components: {
    Back,addBtn,request
  },
  data() {
    return {
      hasActivities:Boolean,
      hasScores:Boolean,

      classInfo: [],
      activityName:[],
      activityScores:[],
      studentsTable:[]
    };
  },
  mounted() {
    this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
    this.getActivities();
    
    
  },
  methods: {
    goAddScore(){
      this.$router.push("/addScore");
    },
    backClass() {
      this.$router.push("/teacherClass");
    },
    async getActivities(){
      let that = this;
      return request({
        url:'/classes/'+this.classInfo.classId,
        method:'get',
      }).then(function(res){
        console.log('class Info',res);
        
        let course = res.data;
        if(course.scores){
          that.hasScores = true;
          if(course.activities){
            that.hasActivities = true;
          let activityNumber = course.activities.item.length;
          let studentNum = course.scores.length;
         that.activityName = course.activities.item;
         that.activityScores = course.activities.value;
        for(let i=0;i<studentNum;i++){
          var student = {
          studentNumber:course.scores[i]['info'][0],
          studentName:course.scores[i]['info'][1],
          scores:course.scores[i]['grade'],
        };
        that.studentsTable.push(student);
        };

        }
        else {
          console.log('res has no activities');
          that.hasActivities = false;
          }
        }
        else{
          console.log('res has no scores');
          that.hasScores = false;
        }
        
        
      })
    },
  },
};
</script>

<style scoped>
   .no-program {
  display: flex;
  flex-direction: column;
}
.studentsTable{
  margin-left: 10%;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.md-padding {
  margin-top: 120px;
 
}
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 18px;
}
.title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
</style>