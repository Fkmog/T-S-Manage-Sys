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
      <el-tooltip
        class="box-item"
        effect="dark"
        placement="bottom"
        
        
        :hide-after="0"
      >
      <template #content>
        <span v-show="hasDetail">
          成绩项
        </span>
        <span v-show="hasNoDetail">
          请先关联课程大纲
        </span>
      </template>
      <el-icon class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          @click="goActivity"
          ><Histogram /></el-icon>
          </el-tooltip>
      <el-divider class="divider" direction="vertical" />
      <el-tooltip
            class="box-item"
            effect="dark"
            content="审核意见"
            placement="bottom"
            :hide-after="0"
          >
      <el-switch v-model="openDrawer" class="switchstyle" @change="openDrawerChange"/>
      </el-tooltip>
    </el-row>
  </div>


  <div layout="row" flex class="md-padding" >
    <addBtn @click="goAddScore" v-show="identity=='教师'"></addBtn>

    <!-- editable @edit="handleTabsEdit"-->
    <div v-show="hasDetail">
<el-tabs v-model="editableTabsValue" v-show="hasScores" type="card" class="activity-tab"  

      @tab-click="editableTabsValueChange"
      
      >
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
  </el-tab-pane>
</el-tabs>



<!-- 学生信息列表 -->
<div class="studentCard" v-show="hasScores">
  
    
      <el-table
        class="studentsTable"
        :data="studentsTable[this.currenteditableTabsValue-1]"
        height="600px"
        :header-cell-style="{  'padding-left':'40px','font-size': '14.4px','height':'63px','font-weight': 'bold','color':'black'}"
        :cell-style="{ 'padding-left':'40px','font-size': '16px','height':'60px' }"
  >
    <el-table-column fixed prop="studentNumber" label="学号"  width="180px"/>
    <el-table-column fixed prop="studentName" label="姓名" width="180px"/>

    <el-table-column v-for="(item,i) in currentactivityName"  :label="item" :key="item" width="180px">
      <template #header>
        <el-col>
          <el-row>
            <span>{{item}}</span>
          </el-row>
          <el-row>
            <span class="subtabletitle">({{currentactivityScores[i]}})/</span>
            <span>{{currentactivityweight[i]}}%</span>
          </el-row>
        </el-col>
        
        
      </template>
      <template #default="scope">
        <span class="scoreintable" @click="showInfo(scope.row)">
          {{ scope.row.scores[this.currenteditableTabsValue-1][i] }}
        </span>
      </template>
    </el-table-column>
      </el-table>
    
    

  
  
</div>
   
  <div v-show="hasNoScores" class="no-program">
      <div style="
  display: flex;
  justify-content: center;
  padding-top: 120px;
  font-size: 22px;
">
        任课教师尚未录入成绩
      </div>
      
      <div style=" 
      display: flex;
      justify-content: center;
      margin-top: 30px;
      font-size: 13px;
      color: #828d96;">
      请先点击右上角圆形按钮添加课程
    </div>
  </div>
    </div>
    <div v-show="hasNoDetail" class="no-program">
      <div style="
  display: flex;
  justify-content: center;
  padding-top: 120px;
  font-size: 22px;
">
        该课程尚未关联课程大纲
      </div>
      <div style=" 
      display: flex;
      justify-content: center;
      margin-top: 30px;
      font-size: 13px;
      color: #828d96;">
      请联系学院管理员关联课程大纲
    </div>
      
  </div>
  </div>
  <reviewDrawer  v-bind:visible="openDrawer"/>
</template>

<script>
import { Back,Histogram } from "@element-plus/icons-vue";
import addBtn from "@/components/general/addBtn.vue";
import { ElMessageBox, ElSwitch,ElMessage} from "element-plus";
import  reviewDrawer  from '@/components/teacherClass/reviewDrawer.vue'

import request from "@/utils/request/request";
export default {
  name: "Score",
  components: {
    Back,addBtn,request,ElSwitch,reviewDrawer,Histogram,ElMessage
  },
  data() {
    return {
      isRespondent:'',

      hasDetail:false,
      hasNoDetail:false,

      openDrawer:false,
      hasActivities:false,
      hasScores:false,
      hasNoScores:false,

      editableTabs:[],
      tabIndex: 0,
      currenteditableTabsValue:0,

      classInfo: [],
      activityName:[],
      currentactivityName:[],
      activityScores:[],
      currentactivityScores:[],
      activityweight:[],
      currentactivityweight:[],
      studentsTable:[],
      tableWidth:'',
    };
  },
  mounted() {
    this.identity = this.$store.state.currentInfo.identity;
    this.openDrawer = this.$store.state.currentInfo.opendrawer;
    if (this.identity == "学院管理员") {
      this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
      console.log("identity:", this.identity);
    } else if (this.identity == "课程负责人") {
      this.classInfo = this.$store.state.currentInfo.respondClassInfo;
      console.log("identity:", this.identity);
    } else {
      this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
      console.log("identity:", this.identity);
    }
    this.getActivities();
    
    
  },
  methods: {
    goActivity(){
      if(this.hasDetail){
        this.$store.commit("course/setbaseCourseCourseId", this.classInfo.courseId);
        this.$store.commit("course/setDetailId", this.classInfo.detailId);
        this.$router.push({ path: "/baseCourseActivities",query: { parentName: 'Score' },});
      }
      else{
        ElMessage({
                    type: 'error',
                    message: `请先关联课程大纲`,
                    duration:1500,
                  });
      }
      
    },
    openDrawerChange(){
      this.$store.commit("currentInfo/setOpenDrawer", this.openDrawer);
    },
    showInfo(row){
      console.log('row',row);
    },
    editableTabsValueChange(pane){
        
      
        let length = 0;
        this.currenteditableTabsValue = Number(pane.props.name);
        this.currentactivityName = this.activityName[this.currenteditableTabsValue-1];
        this.currentactivityScores = this.activityScores[this.currenteditableTabsValue-1];
        this.currentactivityweight = this.activityweight[this.currenteditableTabsValue-1];
        length = (this.currentactivityName.length+1)*180+100;
        this.tableWidth = length.toString()+'px';
        return console.log('currenteditableTabsValue:',Number(pane.props.name));
      },
      handleTabsEdit(targetName, action,activityName) {
        let that = this;
        console.log('action',action);
        if (action === 'add'&& !targetName) {
          
          let item = ['']
          let value = ['']
          let remark = ['']
          let weight = ['']
          let tempdata =[]
          tempdata.push(item);
          tempdata.push(value);
          tempdata.push(remark);
          tempdata.push(weight);
          this.db.items.push(tempdata);
          
          let newTabName = ++this.tabIndex + '';
          this.currenteditableTabsValue = this.tabIndex;
          this.maxeditableTabsValue = this.tabIndex;
          this.editableTabs.push({
            title: '成绩项'+' '+newTabName,
            name: newTabName.toString(),
            value: newTabName
          });
          this.editableTabsValue = newTabName.toString();
          this.hotInstance.updateSettings({
                data:that.db.items[that.currenteditableTabsValue-1],
              });
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue,'maxTabsValue:',this.maxeditableTabsValue);
        }
        if (action === 'add' && targetName) {
          this.currenteditableTabsValue = ++this.tabIndex;
          this.maxeditableTabsValue = this.tabIndex;
          let newTabName = this.tabIndex + '';
          this.editableTabs.push({
            title: (activityName ? activityName:'成绩项'+' '+newTabName),
            name: newTabName.toString(),
            value: newTabName
          });
          this.editableTabsValue = newTabName.toString();
          
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue);
        }
        if (action === 'remove') {
      ElMessageBox.confirm(
      '是否确认删除当前成绩项',
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(()=>{
        let tabs = this.editableTabs;
        // this.currenteditableTabsValue = --this.tabIndex;
        console.log('targetName:',targetName);
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.hotInstance.updateSettings({
                data:that.db.items[Number(activeName-1)],
              });
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          console.log('editableTabs:',this.editableTabs);


      }).catch(e=>{
        console.log('e',e);
      })
          
        }
      },
    goAddScore(){
      this.$router.push("/addScore");
    },
    backClass() {
      this.$router.push("/teacherClass");
    },
    async getActivities(){
      let that = this;
      if(this.classInfo.detailId){
        this.hasDetail = true;
        this.hasNoDetail = false;
        return request({
        url:'/classes/'+this.classInfo.classId,
        method:'get',
      }).then(function(res){
        console.log('class Info',res);
        that.isRespondent = res.data.isRespondent;
        console.log('isRespondent',that.isRespondent);
        let course = res.data;
        let length = 0;
        if(course.scores){
          that.hasScores = true;
          that.hasNoScores = false;
          let count = 0;
          if(course.activities.length){
        that.hasActivities = true;
        course.activities.forEach((activity)=>{
          that.handleTabsEdit(1,'add',activity.name);
          let activityNumber = activity['item'].length;
          that.activityName.push(activity['item']);
          that.activityScores.push(activity['value']);
          that.activityweight.push(activity['weight']);
          

          let studentNum = course.scores.length;
          let tempStudents = [];
          for(let i=0;i<studentNum;i++){
          if(count+1 >course.scores[i]['grade'].length){
            let tempscores=[];
            for(let j=0;j<activityNumber;j++){
              tempscores.push(null);
              }
              course.scores[i]['grade'].push(tempscores);
          }
            var student = {
              studentNumber:course.scores[i]['info'][0],
              studentName:course.scores[i]['info'][1],
              scores:course.scores[i]['grade'],
            }
          
          tempStudents.push(student);
        
          };
          
          that.studentsTable.push(tempStudents);
          
          count++;
        });
        console.log('studentsTable',that.studentsTable);
        that.currentactivityName = that.activityName[0];
        that.currentactivityScores = that.activityScores[0];
        that.currentactivityweight = that.activityweight[0];
        let length = 0;
        length = (that.currentactivityName.length+1)*180+100;
        that.tableWidth = length.toString()+'px';
        
        
        
        that.editableTabsValue = '1';
        that.currenteditableTabsValue = 1;
        console.log('activityName',that.activityName,'activityScores:',that.activityScores,'activityWeight',that.activityweight);
        }
        else {
          console.log('res has no activities');
          that.hasActivities = false;
          }
        }
        else{
          console.log('res has no scores');
          that.hasScores = false;
          that.hasNoScores = true;
        }
        
        
      });
      }else{
        this.hasDetail = false;
        this.hasNoDetail = true;
      }
      
    },
  },
};
</script>

<style scoped>
.switchstyle{
  bottom: 4px;
}
.activity-tab{
  background: white;
  margin-left: 5%;
  margin-right: 5%;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}

.studentCard{
  margin-left: 5%;
  margin-right: 5%;
  height: 500px;
}
.scoreintable{
  margin-left: 19px;
}
.subtabletitle{
  color: grey;
  
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
  margin-top: 90px;
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