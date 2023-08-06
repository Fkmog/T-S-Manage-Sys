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
            
                <FolderChecked />
              </el-icon>
            </el-button>
            </el-tooltip>

            <!-- <el-tooltip
              class="box-item"
              effect="dark"
              content="添加成绩项"
              placement="bottom"
              :hide-after="0"
            >
              <el-icon
                class="icon"
                size="22px"
                color="rgb(137, 137, 137)"
                style="margin-left: 20px"
                
              > -->
              <!-- @click="addActivities" -->
                <!-- <CirclePlus />
              </el-icon>
            </el-tooltip> -->

          </el-row>
      </div>

      <!-- editable @edit="handleTabsEdit"-->
      <el-tabs v-model="editableTabsValue" type="card" class="activity-tab" 
        @tab-click="editableTabsValueChange"
        >
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
      <div layout="row" flex class="md-padding" v-show="hasActivities&&hasObjectives">
          <div class="hot-table-container" flex id="courseHot"></div>
      </div>
      <div v-show="!hasActivities" class="no-program">
        <h2 style="display: flex; justify-content: center; margin-top: 100px">
          未创建成绩项
        </h2>
      </div>
      <div v-show="!hasObjectives" class="no-program">
        <h2 style="display: flex; justify-content: center; margin-top: 100px">
          未创建课程目标
        </h2>
      </div>
    </div>
</template>
    
    <script >
    import { ref, onMounted,reactive} from 'vue'
    
    import { HotTable,HotColumn } from '@handsontable/vue3';
    import { registerAllModules } from 'handsontable/registry';
    import { ElTooltip,ElIcon,ElInput,ElMessage, ElMessageBox } from 'element-plus'
    
    import   Action  from 'element-plus'
    
    import { Back , FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd,CirclePlus} from '@element-plus/icons-vue'
    import Handsontable from 'handsontable';
    import request from '@/utils/request/request'
    import '@/components/teacher/addTeacher.js'
    
    
    import 'element-plus/dist/index.css'
    import 'handsontable/dist/handsontable.full.css'
    
    
    import 'handsontable/dist/handsontable.full.css'
    
    
    
    export default{
      name:'addTeacher',
      inject:['reload'], 
      provide(){
          return{
            reload:this.reload
          }
        },
      data(){
        let self = this;
        return{
          editableTabsValue: '0',
          currenteditableTabsValue:0,
          maxeditableTabsValue:0,
          editableTabs: [],
          tabIndex: 0,



          hasActivities:Boolean,
          hasScores:Boolean,
          hasObjectives:Boolean,
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
          postData: { students: [] ,scores:[],newStudents:[]},
          db: { items: [] },
          departmentId:0,
          fromCourseBatchAdd:false,
          
             
    
        }
      },
      components:{
        ref, onMounted,reactive,HotTable,HotColumn,registerAllModules,ElTooltip,
        ElIcon,ElInput,Handsontable,Back , FolderChecked, InfoFilled, Loading, 
        Download, UploadFilled, DocumentAdd,ElMessage, ElMessageBox,Action,
        CirclePlus
      },
      methods:{
        editableTabsValueChange(pane){
        
        let that = this;
        this.currenteditableTabsValue = Number(pane.props.name);
        this.hotInstance.updateSettings({
                columns:that.columnList[that.currenteditableTabsValue-1],
                data:that.db.items[that.currenteditableTabsValue-1],
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
          this.editableTabsValue = newTabName.toString();
          this.currenteditableTabsValue=1;
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue);
        }
        if (action === 'remove') {
      ElMessageBox.confirm(
      '是否删除当前成绩项',
      '注意',
      {
        confirmButtonText: '确定',
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
// addActivities(){
//         this.firstActivities = false;
//         let length = Object.keys(this.db.items[0]).length-2;
//         let activityName = '成绩项'+length.toString();
//         var activityDict = {
//             data:activityName
//         }
//         this.columnList.push(activityDict)
//         this.hotInstance.updateSettings({
//                 columns:this.columnList,
//               });
//         console.log('db items:',this.db.items,'column List',this.columnList);
//         // this.db.items[0][activityName] = '';
//       },
activate(){
        this.identity = this.$store.state.currentInfo.identity;
        this.departmentId = this.$store.state.currentInfo.departmentId;
        this.schoolId = this.$store.state.currentInfo.schoolId;
        this.programId = this.$store.state.major.programId;
        if(this.identity == '学院管理员'){
          this.classInfo = this.$store.state.currentInfo.adminSideClassInfo;
          console.log('identity:',this.identity);
        }
        else{
          this.classInfo = this.$store.state.currentInfo.teacherSideClassInfo;
          console.log('identity:',this.identity);
        }
        
        console.log('this.departmentId',this.departmentId,'this.schoolId',this.schoolId,'this.programId',this.programId,'this.classInfo',this.classInfo);
        this.activateHotcolumn();
            },
activateHotcolumn(){
    let self = this;
        let that = this;
        this.getActivities().then(function(){
       
        
        let container = document.querySelector("#courseHot");
        let hotRegisterer = new Handsontable(container,{
             data: self.db.items[0],
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: function(index) { // false
                // return index === 0 ? '学号' : '成绩项';
                if (index === 0) {
                return '学号';
                }
                else if (index === 1) {
                return '姓名';
                } else if (index === 2) {
                return '不及格';
                } else {
                return '成绩项';
                }
                },
            rowHeaders: function(index) { // true
                if (index === 0) {
                return '名称';
                } else if (index === 1) {
                return '分值';
                // } else if (index === 2) {
                //   return '平均分';
                // } else if (index === 2) {
                //   return '指标点';
                } else if (index === 2) {
                return '设置';
                } else {
                return index - self.NUM_AUX_ROW + 1;
                }
                // return index === 0 ? '成绩项' : index;
            },
            
            fixedRowsTop: 3,
            fixedColumnsLeft: 2,
            minSpareRows: 0,
            minSpareCols: 0,
            preventOverflow: 'horizontal',
            manualColumnMove: false,
            copyPaste: true,
            colWidths: 70,
            
            contextMenu: {
              items:{
                  'row_above': {
                      name: '在上方插入行'
                  },
                  'row_below': {
                      name: '在下方插入行'
                  },
                  'remove_row': {
                      name: '删除行'
                  }
              }
            },
            afterChange(changes, source) {
              if (source === 'loadData') { 
                console.log('same');
                return;
              } else { 
                self.isValid();
                if(self.count==0){
                  self.dirty=false;
                  console.log("console:", self.count,"dirty", self.dirty,'items:',self.db.items);
                }
                else{
                  self.dirty=true;
                  self.firstActivities = false;
                  console.log("console:", self.count,
                  "dirty", self.dirty,
                  'items:',self.db.items,
                  'firstActivities:',self.firstActivities);
                }
                self.count++;
                console.log('console:',self.count);
                }
            }
        });
        that.hotInstance = hotRegisterer;
        that.hotInstance.updateSettings({
          columns:that.columnList[0],
          data:that.db.items[0],
          cells: that.getHotCellsFunction(),  
              });
        });
},
getHotCellsFunction() {
                
            return function (row, col, prop) {  // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
                var cellProperties = {};
                let that = this;
                if (col === 0) {  // studentNo column
                   
                cellProperties.readOnly = true;
                cellProperties.className = 'cell-disallow';
                }
                if (row < 3  && col < 3 && col!=0) {
                 // left-top zone
                cellProperties.readOnly = false;
                // cellProperties.type = 'string';
                cellProperties.className = 'cell-disallow';
                }
                if (col === 2 && row >= 3) {
                // fail(不及格) column
                cellProperties.type = 'checkbox';
                cellProperties.checkedTemplate = 'F', // F: fail
                cellProperties.uncheckedTemplate = '',
                cellProperties.className = 'cell-disallow';
                }
                if (row != 0 && row != 2 && col >= 3) { 
                // for 2nd row(分值), also validScore
                cellProperties.type = 'numeric';  // by default: 'string'
                //   cellProperties.validator = that.validScore();
                cellProperties.format = '0[.]0';  // http://numeraljs.com/
                } else {
                //   cellProperties.validator =  that.validString();
                }

            

                if (col === 0) {
                cellProperties.width = 100;
                if(row >2){
                    cellProperties.readOnly = false;
                }
                }
                if(col >=0 && col <= 2){
                  if(row >= 0 && row <= 2){
                    cellProperties.readOnly = true;

                  }
                }

                if (col > 2 && row === 2) {
                cellProperties.type = 'dropdown';
                cellProperties.source = [' ','总评','期末'];
                cellProperties.allowEmpty = true;
                cellProperties.className = 'ht-s-size';
                //   cellProperties.validator = that.validScoreSetting();
                }

                return cellProperties;
            };
    },
    _validScore(value) {
      if (/^[1]?[0-9]{1,2}(\.[0-9]+)?$/.test(value)) { // && value <= 100) {
        return true;
      } else {
        return false;
      }
    },
    validScore(value, callback) {
      callback(_validScore(value));
    },
    validString(value, callback) {
      if (value && value.length > 0) {
        callback(true);
      } else {
        callback(false);
      }
    },
    validScoreSetting(value, callback) {
      if (this.scoreSettingOptions.indexOf(value) >= 0) {
        callback(true);
      } else {
        callback(false);
      }
    },



async getActivities(){
      let that = this;
      return request({
        url:'/classes/'+this.classInfo.classId,
        method:'get',
      }).then(function(res){
        console.log('class Info',res);
        
        let course = res.data;
        if(course.objectives){
          that.hasObjectives = true;
        }
        else{
          that.hasObjectives = false;
        }
        if(course.scores){
          that.hasScores = true;
          let count = 0;
          if(course.activities&&that.hasObjectives){
            that.hasActivities = true;
            course.activities.forEach((activity)=>{
            that.handleTabsEdit(1,'add',activity.name);
            let activityNumber = activity['item'].length;
            console.log('activityNumber:',activityNumber);
            let studentNum = course.scores.length;
            that.currentNumberofActivities = activityNumber;
          
          let tempList = [];
          for(let i=0;i<studentNum+3;i++){
            // that.db.items[i]={};
            tempList[i]={};
          }
          let tempcolumnList = [{
                data:'studentNumber',
            },
            {
                data:'studentName',
            },
            {
                data:'pass',
            },];
         for(let i=0;i<activityNumber;i++){
        //   itemDict[i.toString()] = course.activities.item[i];
        var columnDist = {};
          // that.db.items[0][course.activities[0]['item'][i]]= course.activities[0]['item'][i];
          tempList[0][activity['item'][i]] = activity['item'][i];
          // that.db.items[1][course.activities[0]['item'][i]]= course.activities[0]['value'][i];
          tempList[1][activity['item'][i]] = activity['value'][i];
          // that.db.items[2][course.activities[0]['item'][i]]= course.activities[0]['remark'][i];
          tempList[2][activity['item'][i]] = activity['remark'][i];
          columnDist={
            data:activity['item'][i],
          }
          tempcolumnList.push(columnDist);
        //   valueDict[i.toString()] = course.activities.value[i];
         }
         console.log('tempcolumnList:',tempcolumnList);
          for(let i=0;i<studentNum;i++){
            // console.log('number:',3+i);
            // that.db.items[3+i]['studentNumber']= course.scores[i]['info'][0];
            tempList[3+i]['studentNumber'] = course.scores[i]['info'][0];
            // that.db.items[3+i]['studentName']=course.scores[i]['info'][1];
            tempList[3+i]['studentName'] = course.scores[i]['info'][1];
            // that.db.items[3+i]['pass']=(course.scores[i]['info'][2]=='')? '':'F';
            tempList[3+i]['pass'] = (course.scores[i]['info'][2]=='')? '':'F';
            if(count+1 >course.scores[i]['grade'].length){
              // console.log('该成绩项下，并未添加学生成绩')
              
              for(let j=0;j<activityNumber;j++){
                tempList[3+i][activity['item'][j]] = 0;
              }
              
            }
            else{
            for(let j=0;j<activityNumber;j++){
              if(!course.scores[i]['grade'][count][j]){
                //[count++]
                // that.db.items[3+i][course.activities[0]['item'][j]] = 0;
                tempList[3+i][activity['item'][j]] = 0;
              }
              else{
                // that.db.items[3+i][course.activities[0]['item'][j]] = course.scores[i]['grade'][j];
                // tempList[3+i][activity['item'][j]] =  course.scores[i]['grade'][count++][j];
                tempList[3+i][activity['item'][j]] =  course.scores[i]['grade'][count][j];
              }
                
            }

            }
            
          };
          that.columnList.push(tempcolumnList);
          that.db.items.push(tempList);
          count++;
            });
          that.editableTabsValue = '1';
          that.currenteditableTabsValue = 1;
          console.log('db.items',that.db.items,'columnList:',that.columnList);
        }
        else {
          console.log('res has no activities');
          that.handleTabsEdit(1,'add');
          that.hasActivities = false;
         
          }
        }
        else{
          console.log('res has no scores');
          that.handleTabsEdit(1,'add');
          that.hasScores = false;
          if(course.activities&&that.hasObjectives){
            that.hasActivities = true;
            course.activities.forEach((activity)=>{
            that.handleTabsEdit(1,'add');
            let activityNumber = activity['item'].length;
            let studentNum = course.scores.length;
            that.currentNumberofActivities = activityNumber;
          
          let tempList = [];
          for(let i=0;i<studentNum+3;i++){
            // that.db.items[i]={};
            tempList[i]={};
          }
         let tempcolumnList = [{
                data:'studentNumber',
            },
            {
                data:'studentName',
            },
            {
                data:'pass',
            },];
         for(let i=0;i<activityNumber;i++){
        //   itemDict[i.toString()] = course.activities.item[i];
        var columnDist = {};
          // that.db.items[0][course.activities[0]['item'][i]]= course.activities[0]['item'][i];
          tempList[0][activity['item'][i]] = activity['item'][i];
          // that.db.items[1][course.activities[0]['item'][i]]= course.activities[0]['value'][i];
          tempList[1][activity['item'][i]] = activity['value'][i];
          // that.db.items[2][course.activities[0]['item'][i]]= course.activities[0]['remark'][i];
          tempList[2][activity['item'][i]] = activity['remark'][i];
          columnDist={
            data:activity['item'][i],
          }
          tempcolumnList.push(columnDist);
          
          
         
        //   valueDict[i.toString()] = course.activities.value[i];
         }
          that.columnList.push(tempcolumnList);
          that.db.items.push(tempList);
            });
          console.log('db.items',that.db.items,'columnList:',that.columnList);
        }
        }
        
        
      })
    },
      isValid(){
        if(this.firstActivities){
        return false;
      }
      else{
        var result = this.toPostData();
        console.log('result:',result);
          return !(!result);
      }



       
      },
      isNotDirty(){
        
        this.dirty=false;
      },
      save() {
        this.saving = true;
        this.dirty = false;
        var result = this.isValid();
          if (!result) {
            this.saving = false;
            return;
          }
            let that =this;
            
            let allStudentsNumber = []
            let studentList = JSON.parse(JSON.stringify(that.db.items[0]));
            
            for(let m=0;m<3;m++){
                studentList.shift();
            }
            for(let i=0;i<studentList.length;i++){
                // console.log('studentInfo:',studentList[i]);
                if(studentList[i]['studentNumber']!=undefined){
                  allStudentsNumber.push(studentList[i]['studentNumber']);
                }
            }
            let count=0;
            allStudentsNumber.forEach((studentNumber)=>{
              
              let infoList = [];
              let finalGrade = [];
              that.db.items.forEach((activity)=>{
                let gradList = [];
                let student = JSON.parse(JSON.stringify(activity));
                for(let m=0;m<3;m++){
                  student.shift();
                };
                for(let i=0;i<studentList.length;i++){
                  if(student[i]['studentNumber']==studentNumber){
                    // console.log('socres:',student.values())
                    for(var key in student[i]){
                      // console.log('key',key,'student[key]',student[i][key])
                      if(key == 'studentNumber'|| key == 'studentName'|| key == 'pass'){
                        infoList.push(student[i][key]);
                      }
                      else{
                        gradList.push(student[i][key]);
                        
                      }
                    }
                  }
                  
            }
            finalGrade.push(gradList);
              })
              console.log('info:',infoList,'grade:',finalGrade);
              var scoreDist = {
                'info':[infoList[0],infoList[1],infoList[2]],
                'grade':finalGrade,
              }
              
              console.log('scoreDist',scoreDist,count++);
              that.postData.scores.push(scoreDist);
            });

            that.addScores(that.postData.scores);
         
            
            

            
      
    },
      toPostData(){
        let that = this;
        this.postData.students.length = 0; // clean array
        var res = this.postData.students;
        // var newstudent = this.postData.newStudents;
        // var scoreRes = this.postData.scores;
        
        var valid = true;
        var OrFlag = Boolean;
        var AndFlag = Boolean;
        var trueFlagNum = 0;//为空的个数
        var falseFlagNum = 0;//不为空的个数
        // studentList.forEach(function(student){
        //   that.columnList.forEach((column)=>{
        //     let activityNumber = column.length;
            
        //     var trueFlagNum = 0;//为空的个数
        //     var falseFlagNum = 0;//不为空的个数
        //         // console.log('current student:',student);
        //         for(let j=0;j<activityNumber-3;j++){
        //             let activityLabel = column[3+j];//从columnList中获取成绩项名称
                    
        //             console.log('student[activityLabel.data]',student[activityLabel.data]);//去student[activityLabel.data]查看是否为空
        //             if(!student[activityLabel.data]){
        //                 trueFlagNum++;
        //             }
        //             else{
        //                 falseFlagNum++;
        //             }
        //       };
        //      // true means null, false mens not null
        //       if(trueFlagNum>0){
        //         OrFlag = true;
        //         if(trueFlagNum == activityNumber-3){
        //             AndFlag = true;
        //         }
        //         else{
        //             AndFlag = false;
        //         }
        //       }
        //       else{
        //         OrFlag = false;
        //         AndFlag = false;
        //       }
        //       console.log('OrFlag:',OrFlag,'AndFlag:',AndFlag);
        //     if (!student.studentNumber || !student.studentName || OrFlag) {
        //       if (!student.studentNumber && !student.studentName && AndFlag) {
        //         // console.log('scoreRes:',scoreRes,'res: ',res);
        //         console.log('----------全都为空------------');
        //         return;
        //       } else {  // either name OR teacherNo is empty, but not both
        //         valid = false;
        //         // console.log('scoreRes:',scoreRes,'res: ',res);
        //         console.log('-----------部分为空-----------',student.studentNumber,student.studentName);
        //         return;
        //       }
        //     } 
        //     else {  // both are not empty: post 添加学生
        //       // var distTeacher = {
        //       //   'studentNumber':student.studentNumber,
        //       //   'studentName':student.studentName,
        //       //   // 'email':teacher.email,
        //       //   'programId': that.programId,
        //       //   // 'pass':student.pass,
        //       //   'departmentId':that.departmentId,
        //       //   'schoolId':that.schoolId
        //       // };
        //     // res.push(distTeacher);
        //     // console.log('scoreRes:',scoreRes,'res: ',res);
        //     // console.log('-----------都不空-----------');
        //     };
        //   })
            
        //   });
      this.db.items.forEach((students)=>{
        var studentList = JSON.parse( JSON.stringify(students));
        
        for(let m=0;m<3;m++){
            studentList.shift();
        }
        for(let i=0;i<studentList.length;i++){
                  if(studentList[i]['studentNumber']){
                    // console.log('socres:',student.values())
                    for(var key in studentList[i]){
                      // console.log('key',key,'studentList[key]',studentList[i][key])
                        if(key != 'pass'&&!studentList[i][key]){
                          trueFlagNum++;
                        }
                        else{
                          falseFlagNum++;
                        }
                      
                    }
                  }
                  else{
                    // console.log("studentList[i]['studentNumber']:",studentList[i]['studentNumber'])
                  }
                  
            }
      });
      let activityNumber = 0;
      this.columnList.forEach((column)=>{
        activityNumber = activityNumber+column.length-3;
      })
      console.log('trueFlagNum:',trueFlagNum);
      if(trueFlagNum>0){
                OrFlag = true;
                if(trueFlagNum == activityNumber){
                    AndFlag = true;
                }
                else{
                    AndFlag = false;
                }
              }
              else{
                OrFlag = false;
                AndFlag = false;
              }
      console.log('OrFlag:',OrFlag,'AndFlag:',AndFlag);
      if (OrFlag) {
      if (AndFlag) {
        // console.log('scoreRes:',scoreRes,'res: ',res);
        console.log('----------全都为空------------');
        return;
      } else {  // either name OR teacherNo is empty, but not both
        valid = false;
        // console.log('scoreRes:',scoreRes,'res: ',res);
        console.log('-----------部分为空-----------');
        return;
      }
      
    } else{
        
      }


          return valid;
      },
// async searchForStudent(){
//     let that = this;
//     var newStudentList = [];
//     var addFlag = Boolean;
//     // console.log('this.postData.newStudents:',this.postData.newStudents);
//             this.postData.newStudents.forEach(function(student){
//                         newStudentList.push(student);
//             });

//             console.log('newStudentList:',newStudentList);
            
//                 this.addTeacher(newStudentList).then(function(res){
//                 console.log('add student res:',res);
//                 that.firstActivities = true;
//                 //   that.getActivities();
//                 if(res.code == '200'){
//                     ElMessage({
//                         type: 'success',
//                         message: `添加成功`,
//                         duration:1000,
//                     });
//                     addFlag = true;
//                 }
//                 else{
//                 ElMessage({
//                         type: 'error',
//                         message: `添加失败`,
//                         duration:1000,
//                     })
//                     addFlag = false;
//             }
//                 });
//             return  addFlag;
                  
// },

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
      
      this.getActivities().then(function(res){
        that.hotInstance.updateSettings({
                data:that.db.items[that.currenteditableTabsValue-1],
                column:that.columnList[that.currenteditableTabsValue-1]
              });
        that.dirty = false;
        console.log('datas:', that.db.items,that.postData.students);
      })
      
      
    },
    reload(){
      this.isRouterAlive = false;
      this.count = 0;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    goTeacher(){
      console.log('goteacher:'+this.saving+this.dirty);//只有dirty = flase 或者 saving = true时才可以退出
      
      
      if(this.dirty == true || this.saving== false&&this.dirty == true ){
        ElMessageBox.confirm(
        '数据还未保存，是否仍然关闭？',
        '注意',
        {
          confirmButtonText: '确定',
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
//  async searchStudent(postData){
    
//         return request({
//             url:'/student/number'+'/'+postData,
//             method:'get'
//         }).then(function(res){
//             console.log('searching for studentNumber:',postData,'student search res:',res);
//             if(res.data == undefined){
                
//                 return true;
//             }
//             else{
//                 return false;
//             }
            
//         })
//     },
//  async addTeacher(postData){
//       var localres;
//       console.log('student postData:',postData);
//       return request({
//                 url:'/student/addStudents',
//                 method:'post',
//                 data:postData
//             }).then(function(res){
//               localres = res;
              
//               return localres;
//             });
//     },
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
            console.log('saving scores res:',res);
            that.firstActivities = true;
            if(res.code == 'SUCCESS'){
                ElMessage({
                    type: 'success',
                    message: `成绩保存成功`,
                    duration:1500,
                  });
                 that.goBackandClean();
            }
             
              
      
        }).catch(e=>{
          console.log('e:',e);
          that.postData.scores = [];
        })
    }
    
      },
      mounted:function(){
        this.activate();
      },
    }
    
    
     
    </script>
    
    <style  scoped>
    .activity-tab{
      margin-top: 100px;
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
    width: 50%;
    margin-left: 20%;
    margin-right: 25%;
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
    