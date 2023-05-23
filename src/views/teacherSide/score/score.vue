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
    :style="{width: tableWidth}" 
    :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'48px','font-weight': 'bold','color':'black'}"
    :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
    v-show="hasScores"
  >
    <el-table-column prop="studentNumber" label="学号"  width="180px"/>
    <el-table-column prop="studentName" label="姓名" width="100px"/>
    <!-- <el-table-column>
      <template #header="scope1">
        <span>成绩</span>
      </template>
      <template #default="scope">
        <el-row>
          <el-col v-for="(item,i) in activityName" :key="item.name" :span="4">
          {{ item }}
          <el-row>{{ scope.row.scores[i]}}/{{ activityScores[i]  }}</el-row>
        </el-col>
        </el-row>
      </template>
    </el-table-column> -->
    <el-table-column v-for="(item,i) in activityName"  :label="item" :key="item" width="180px">
      <template #header>
        <el-col>
          <el-row>
            <span>{{item}}</span>
          </el-row>
          <el-row>
            <span class="subtabletitle">({{activityScores[i]}})</span>
          </el-row>
        </el-col>
        
        
      </template>
      <template #default="scope">
        <span class="scoreintable">
          {{ scope.row.scores[i] }}
        </span>
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
      studentsTable:[],
      tableWidth:'',
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
        let length = 0;
        if(course.scores){
          that.hasScores = true;
          if(course.activities){
            that.hasActivities = true;
          let activityNumber = course.activities.item.length;
          let studentNum = course.scores.length;
         that.activityName = course.activities.item;
         length = (that.activityName.length+1)*180+100;
         that.tableWidth = length.toString()+'px';
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
.scoreintable{
  margin-left: 19px;
}
.subtabletitle{
  color: grey;
  margin-left: 14px;
  font-weight: 500;
}
   .no-program {
  display: flex;
  flex-direction: column;
}
.studentsTable{
  margin: 0 auto;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
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