<template>
    <div layout="column" flex class="ng-scope layout-column flex" v-if="isRouterAlive">
      <div class="block">
          <el-row class="block-row">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="返回"
              placement="bottom"
              :hide-after="0"
            >
            <el-button
            link
            @click="goTeacher()"
            >
            <el-icon
                class="icon"
                size="24px"
                color="rgb(137, 137, 137)"
                style="margin-left: 50px"
                
              >
                <Back />
              </el-icon>
            </el-button>
              
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="保存成绩"
              placement="bottom"
              :hide-after="0"
              
            >
            <el-button 
            @click="save" 
            link
            :disabled="!isValid()" >
              <el-icon
                size="24px"
                color="rgb(137, 137, 137)"
                style="margin-left: 20px"
              >
            
                <DocumentChecked />
              </el-icon>
            </el-button>
            </el-tooltip>

            

          </el-row>
      </div>

   

      <div class="card-container"  >
          <div class="hot-table-container" id="courseHot"></div>  
      </div>
   
    </div>
</template>
    
    <script >
    import { ref, onMounted,reactive} from 'vue'
    
    import { HotTable,HotColumn } from '@handsontable/vue3';
    import { registerAllModules } from 'handsontable/registry';
    import { ElTooltip,ElIcon,ElInput,ElMessage, ElMessageBox } from 'element-plus'
    import {getExamAnalysis,editExamAnalysis} from '@/api/exam'
    
    import   Action  from 'element-plus'
    
    import { Back , FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd,CirclePlus,DocumentChecked} from '@element-plus/icons-vue'
    import Handsontable from 'handsontable';
    import request from '@/utils/request/request'
    import '@/components/teacher/addTeacher.js'
    
    
    import 'element-plus/dist/index.css'
    import 'handsontable/dist/handsontable.full.css'
    
    
    import 'handsontable/dist/handsontable.full.css'
    
    
    
    export default{
      name:'addTeacher',
      data(){
        let self = this;
        return{


          objectivesName:['题号','分值'],
          editableTabsValue: '0',
          currenteditableTabsValue:0,
          maxeditableTabsValue:0,
          editableTabs: [],
          tabIndex: 0,

          originData:[],



          hasActivities:false,
          hasNoActivities:false,
          hasScores:false,
          hasNoScores:false,
          hasObjectives:false,
          hasNoObjectives:false,
          departmentId:'',
          schoolId:'',
          programId:'',
          classInfo:'',

          //一开始有多少行和列
          NUM_AUX_ROW:3,
          NUM_AUX_COL:2,
        ROW_INDEX_ACTIVITY : 0,
        ROW_INDEX_TOTALSCORE : 1,
        ROW_INDEX_SCORESETTING : 2,
    
        currentNumberofActivities:0,
  
        firstActivities:true,

        //添加学生
        addNewStudentList:[],
        hotInstance: undefined,
        columnList:[],
        scoreSettingOptions:['总评','期末'],
          isRouterAlive:true,
          dirty:false,
          saving:false,
          count:0,
          localres:{},
          postData: { students: [] ,scores:[],newStudents:[],averageScore:{
            averageScoreOnTitle:[],
            scoreRateOnTitle:[],
            averageScoreOnObject:[],
            scoreRateOnObject:[]
          }},
          db: { items: [],objectives:[] },
          departmentId:0,
          fromCourseBatchAdd:false,
          
             
    
        }
      },
      components:{
        ref, onMounted,reactive,HotTable,HotColumn,registerAllModules,ElTooltip,
        ElIcon,ElInput,Handsontable,Back , FolderChecked, InfoFilled, Loading, 
        Download, UploadFilled, DocumentAdd,ElMessage, ElMessageBox,Action,
        CirclePlus,DocumentChecked
      },
      methods:{
        editableTabsValueChange(pane){
        
        let that = this;
        this.currenteditableTabsValue = Number(pane.props.name);
        this.hotInstance.updateSettings({
                columns:that.columnList[that.currenteditableTabsValue-1],
                data:that.db.items[that.currenteditableTabsValue-1],
                cells: that.getHotCellsFunction(), 
              });
        return console.log('currenteditableTabsValue:',Number(pane.props.name));
        
        
      },
      handleTabsEdit(targetName, action,activityName) {
        let that = this;
        console.log('action',action,'targetName',targetName,'activityName',activityName);
        if (action === 'add'&& !targetName) {
          console.log('handleTabsEdit add processing');
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
                cells: that.getHotCellsFunction(), 
              });
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue,'maxTabsValue:',this.maxeditableTabsValue);
        }
        if (action === 'add' && targetName && activityName) {
          console.log('handleTabsEdit 初始化 processing');
          this.currenteditableTabsValue = ++this.tabIndex;
          this.maxeditableTabsValue = this.tabIndex;
          let newTabName = this.tabIndex + '';
          this.editableTabs.push({
            title: (activityName ? activityName:'成绩项'+' '+newTabName),
            name: newTabName.toString(),
            value: newTabName
          });
          this.editableTabsValue = this.editableTabs[0].name;
          this.currenteditableTabsValue = 1;
          // this.hotInstance.updateSettings({
          //       data:that.db.items[that.currenteditableTabsValue-1],
          //     });
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue);
        }
        if (action === 'remove') {
      ElMessageBox.confirm(
      '是否确认删除成绩项',
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
                cells: that.getHotCellsFunction(), 
              });
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          console.log('editableTabs:',this.editableTabs);


      }).catch(e=>{
        console.log('e',e);
      })
          
        }
      },
        activate(){
            this.identity = this.$store.state.currentInfo.identity;
            this.departmentId = this.$store.state.currentInfo.departmentId;
            this.schoolId = this.$store.state.currentInfo.schoolId;
            this.programId = this.$store.state.major.programId;
            if (this.identity == "学院管理员") {
            this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
            console.log("identity:", this.identity);
            } else if (this.identity == "课程负责人") {
            this.classInfo = this.$store.state.currentInfo.respondClassInfo;
            } else {
            this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
            console.log("identity:", this.identity);
            }
            
            console.log('this.departmentId',this.departmentId,'this.schoolId',this.schoolId,'this.programId',this.programId,'this.classInfo',this.classInfo);
            this.getActivities();
        },
        activateHotcolumn(){
            console.log('Handsontable init')
                let self = this;
                let that = this;
                let container = document.querySelector("#courseHot");
                let hotRegisterer = new Handsontable(container,{
                    data: self.db.objectives,
                    licenseKey: 'non-commercial-and-evaluation',
                    colHeaders: false,
                    dragToScroll: true,
                    rowHeaders: self.objectivesName,
                    rowHeaderWidth: 100,
                    copyPaste: true,
                    allowRemoveColumn: true,
                    colWidths: 100,
                    
                    contextMenu: {
                        items: {
                            col_left: {
                            name: "在左侧插入列",
                            },
                            col_right: {
                            name: "在右侧插入列",
                            },
                            remove_col: {
                            name: "删除列",
                            },
                        },
                        },
                   
                    

                    afterChange(changes, source) {
                      if (source === 'loadData') { 
                        // console.log('same');
                        return;
                      } else { 
                        self.isValid();
                        if(self.count==0){
                          self.dirty=false;
                        //   console.log("console:", self.count,"dirty", self.dirty,'items:',self.db.items);
                        }
                        else{
                          self.dirty=true;
                          self.firstActivities = false;
                        //   console.log("console:", self.count,
                        //   "dirty", self.dirty,
                        //   'items:',self.db.items,
                        //   'firstActivities:',self.firstActivities);
                        }
                        self.count++;
                        // console.log('console:',self.count);
                        }
                    }
                });
                that.hotInstance = hotRegisterer;
                that.hotInstance.updateSettings({
                  data:that.db.objectives,
                  cells: that.getHotCellsFunction(),  
                      });
                
        },
        getHotCellsFunction() {
                    let that = this;
                    return function (row, col, prop) {  // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
                        var cellProperties = {};
                        if((row >=that.objectivesName.length-2 && col<that.db.objectives['0'].length-2) ||(row <that.objectivesName.length-2 && col>=that.db.objectives['0'].length-2)){
                            cellProperties.readOnly = false
                        }
                        else{
                            cellProperties.readOnly = true
                        }
                        
                        

                        return cellProperties;
                    };
            },
 getActivities(){
      let that = this;
      getExamAnalysis(this.classInfo.classId).then((res)=>{
        console.log('getExamAnalysis',res);
        let setting = res.data.setting;
        let averageScore = res.data.averageScore;
        setting.object.forEach((objectname)=>{
              this.objectivesName.push(objectname)
            })
        
        this.objectivesName.push('平均得分')
        this.objectivesName.push('得分率')
        console.log('objectivesName',this.objectivesName)
        if(setting.sum){
            
            // this.objectivesName.concat(setting.object);
            
            let sum = ['合计']
            sum = sum.concat(setting.title)
            sum.push('平均得分')
            sum.push('得分率')
            this.db.objectives.push(sum);

            for(let i=0;i<setting.sum.length;i++){
            let templist = []
            templist.push(setting.sum[i])
            
            for(let j=0;j<setting.value[i].length;j++){
                templist.push(setting.value[i][j])
            }
            templist.push(averageScore.averageScoreOnObject[i])
            if(averageScore.scoreRateOnObject[i]){
                templist.push(averageScore.scoreRateOnObject[i]+'%')
            }
            else{
                templist.push(averageScore.scoreRateOnObject[i])
            }
            
            
            
            this.db.objectives.push(templist)
            }
        
            let templistaverageScoreOnTitle = ['']
            averageScore.averageScoreOnTitle.forEach((averageScoreOnTitle)=>{
                templistaverageScoreOnTitle.push(averageScoreOnTitle)
            })
            this.db.objectives.push(templistaverageScoreOnTitle)
            let templistscoreRateOnTitle = ['']
            averageScore.scoreRateOnTitle.forEach((scoreRateOnTitle)=>{
                if(scoreRateOnTitle){
                    templistscoreRateOnTitle.push(scoreRateOnTitle+'%')
                }
                else{
                    templistscoreRateOnTitle.push(scoreRateOnTitle)
                }
                
            })
            this.db.objectives.push(templistscoreRateOnTitle)
            
            
            
            }
            else{
            setting.object.forEach(()=>{
                this.db.objectives.push([''])
            })
            }
            console.log('this.db.objectives',this.db.objectives)
            this.activateHotcolumn();
          
      })
    },
      isValid(){
        if(this.firstActivities){
        return false;
      }
      else{
        var result = this.toPostData();
          return result;
      }
      },
      compareArrays(arr1, arr2) {
        console.log('arr1',arr1,'arr2',arr2);
  // 检查数组长度是否相等
  console.log('length:',arr1.length,arr2.length);
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 深度比较每个对象
  for (let i = 0; i < arr1.length; i++) {
    // 检查对象属性数量是否相等
    console.log('Object.keys:',Object.keys(arr1[i]).length,Object.keys(arr2[i]).length);
    if (Object.keys(arr1[i]).length !== Object.keys(arr2[i]).length) {
      return false;
    }

    // 检查对象属性值是否相等
    for (let key in arr1[i]) {
      console.log('keys:',arr1[i][key],arr2[i][key]);
      if (arr1[i][key] !== arr2[i][key]) {
        return false;
      }
    }
  }

  return true;
},
      isNotDirty(){
        
        this.dirty=false;
      },
      save() {
        this.saving = true;
        this.dirty = false;
        this.postData.averageScore = {
            averageScoreOnTitle:[],
            scoreRateOnTitle:[],
            averageScoreOnObject:[],
            scoreRateOnObject:[]
        };
        var result = this.isValid();
          if (!result) {
            this.saving = false;
            return;
          }
          console.log('this.db.objectives',this.db.objectives);
          let tempaverageScoreOnObject = []
          let tempscoreRateOnObject = []
        this.db.objectives.forEach((row)=>{
            if(row[this.db.objectives['0'].length-2]!== '平均得分' && row[this.db.objectives['0'].length-1]!== '得分率' && row[0]){
                console.log('row',typeof(row[this.db.objectives['0'].length-2]));
                if(typeof(row[this.db.objectives['0'].length-2])==='string'){
                    tempaverageScoreOnObject.push(parseFloat(row[this.db.objectives['0'].length-2].trim()))
                    
                }else{
                    tempaverageScoreOnObject.push(parseFloat(row[this.db.objectives['0'].length-2]))
                }

                if(typeof(row[this.db.objectives['0'].length-1])==='string'){
                    tempscoreRateOnObject.push(parseFloat(row[this.db.objectives['0'].length-1].trim()))
                }else{
                    tempaverageScoreOnObject.push(parseFloat(row[this.db.objectives['0'].length-1]))
                }
                

                
            }
        })
        this.postData.averageScore.averageScoreOnObject = tempaverageScoreOnObject;
        this.postData.averageScore.scoreRateOnObject = tempscoreRateOnObject;

        
            for(let j = 1;j<this.db.objectives['0'].length-2;j++){
                if(typeof(this.db.objectives[this.objectivesName.length-2][j])==='string'){
                    this.postData.averageScore.averageScoreOnTitle.push(parseFloat(this.db.objectives[this.objectivesName.length-2][j].trim()))
                }
                else{
                    this.postData.averageScore.averageScoreOnTitle.push(parseFloat(this.db.objectives[this.objectivesName.length-2][j]))
                }

                if(typeof(this.db.objectives[this.objectivesName.length-1][j])==='string'){
                    this.postData.averageScore.scoreRateOnTitle.push(parseFloat(this.db.objectives[this.objectivesName.length-1][j].trim()))
                }
                else{
                    this.postData.averageScore.averageScoreOnTitle.push(parseFloat(this.db.objectives[this.objectivesName.length-1][j]))
                }
                
                
            }
        delete this.postData.averageScore['length']
        console.log('this.postData.averageScore',this.postData.averageScore)

        editExamAnalysis({'averageScore':this.postData.averageScore,'classId':this.classInfo.classId}).then((res)=>{
            console.log('editExamAnalysis:',res);
            if(res.code == 'SUCCESS'){
            ElMessage({
              type: "success",
              message: "更新成功",
              duration: 1500,
            });
          }
        }).catch((e)=>{
          ElMessage({
              type: "error",
              message: e.msg,
              duration: 1500,
            });
        
        })
      
    },
      toPostData(){
        this.postData.averageScore.length = 0;
        let valid = true;
        if(this.db.objectives['0']){
          for(let i=0;i<this.db.objectives[0].length;i++){
          if(!this.db.objectives['0'][i]){
            valid = false;
            break;
          }
        }
        }
        else{
          valid = false;
        }
        
        
          
        
        return valid;
      },


    goBackandClean(){
      let that = this;
      // this.db.items = [];
      // this.columnList = [{
      //         data:'studentNumber',
      //     },
      //     {
      //         data:'studentName',
      //     },
      //     {
      //         data:'pass',
      //     },];
      // this.postData.students = [];
      this.postData.scores = [];
      // this.postData.newStudents = [];
      
      // this.getActivities().then(function(res){
      //   that.hotInstance.updateSettings({
      //           data:that.db.items[that.currenteditableTabsValue-1],
      //           column:that.columnList[that.currenteditableTabsValue-1]
      //         });
      //   that.dirty = false;
      //   console.log('datas:', that.db.items,that.postData.students);
      // })
      
      
    },
    goTeacher(){
      console.log('goteacher:'+this.saving+this.dirty);//只有dirty = flase 或者 saving = true时才可以退出
      
      
      if(this.dirty == true || this.saving== false&&this.dirty == true ){
        ElMessageBox.confirm(
        '数据还未保存，是否仍然关闭？',
        '',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.$router.push({ path:'/score'});
        })
        .catch(() => {
          
        })
      }
      else{
        
        this.$router.push({ path:'/score'});
      
      }
    },

    addScores(postData){
        let that = this;
        console.log('score postData:',postData);
        return request({
            url:'/classes/editScores',
            method:'post',
            data:{
                'classId':this.classInfo.classId,
                'scores':postData,
            }
        }).then(function(res){
          that.postData.scores = [];
          console.log('saving scores res:',res);
          that.firstActivities = true;
          if(res.code == 'SUCCESS'){
              ElMessage({
                  type: 'success',
                  message: `更新成功`,
                  duration:1500,
                });
                that.goBackandClean();
          }
          console.log('postData.scores', that.postData.scores);
        }).catch(e=>{
          console.log('e:',e);
          ElMessage({
                  type: 'error',
                  message: e.code,
                  duration:1500,
                });
          // console.log('postData.scores', that.postData.scores);
        })
    }
    
      },
      mounted:function(){
        this.activate();
      },
    }
    
    
     
    </script>
    
    <style  scoped>
    .card-container{
    margin-left: 10%;
    margin-top: 100px;
    width: 80%;
    height: 600px;
    background-color: white;
    box-shadow: 0px 1px 3px rgb(164, 163, 163);
    overflow: auto; 
    /* 这里用auto而不是hidden，应为hidden会直接把多出的部分删除，而auto则会保留多出来的部分，形成页面滑动scroll */
  }
    .activity-tab{
    margin-top: 68px;
    background: white;
    box-shadow: 0px 1px 3px rgb(164, 163, 163);
    width:80%;
    margin-left: 10%;
    }
    .no-program {
  display: flex;
  flex-direction: column;
}
    .icon {
  cursor: pointer;
}
    .block-row {
  margin-top: 15px;
}
    .block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
    .hot-table-container{
      
      height: 100px;
  }
    .hotTable{
      box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
    }
    .md-padding{
      margin-top: 120px;
    }
    .ng-scope layout-column flex{
    display: flex;
    flex-direction: column;
    }
   
   
    
    #luckysheet {
      margin: 0px;
      padding: 0px;
      border:1px aquamarine;
      /* position: absolute; */
      width: 100%;
      height: 750px;
      /* left: 0px; */
      margin-top: 20px;
      /* top: 30px; */
      bottom: 0px;
    }
    
    #uploadBtn {
      font-size: 16px;
    }
    
    
    </style>
    