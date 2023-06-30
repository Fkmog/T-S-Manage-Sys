<template>
  <div layout="column" flex class="ng-scope layout-column flex" >
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
          @click="gobaseCourseDetail()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">课程信息</div>
      <el-divider class="divider" direction="vertical" />
      

      <el-tooltip
        class="box-item"
        effect="dark"
        content="保存成绩项"
        placement="bottom"
        :hide-after="0"
        
      >
      <el-button 
      @click="save" 
      link
      style="padding-left: 20px;"
      :disabled="!isValid()" >
        <el-icon
          
          size="22px"
          color="rgb(137, 137, 137)"
          style="top:-1px;"
          
        >
        <!-- :disabled="!isValid()" -->
          <DocumentChecked />
        </el-icon>
      </el-button>
        
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="添加成绩项"
        placement="bottom"
        :hide-after="0"
      >
      <el-button 
      @click="addActivities" 
      link 
      :disabled="!over25"
      style="padding-left: 20px;"
      >
        <el-icon
          size="22px"
          color="rgb(137, 137, 137)"
         
        >
          <CirclePlus />
        </el-icon>
      </el-button>
        
      </el-tooltip>

    </el-row>
  </div>



  <!-- @tab-add="this.handleTabsEdit('','add')"   -->
  <el-tabs v-model="editableTabsValue" type="card" class="activity-tab" editable 

  @tab-click="editableTabsValueChange"
  @edit="handleTabsEdit"

  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
   
    >
    </el-tab-pane>
  </el-tabs>
  
    <div class="hot-table-container" id="courseHot"></div>  
 
  

      





    </div>
  
    
  </template>
  
  <script >
  import { ref, onMounted,reactive} from 'vue'
  
  import { HotTable,HotColumn } from '@handsontable/vue3';
  import { registerAllModules } from 'handsontable/registry';
  import { ElTooltip,ElIcon,ElInput,ElMessage, ElMessageBox } from 'element-plus'
  
  import   Action  from 'element-plus'
  
  import { Back , FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd,CirclePlus,DocumentChecked} from '@element-plus/icons-vue'
  import Handsontable from 'handsontable';
  import request from '@/utils/request/request'
 
  
  
  import 'element-plus/dist/index.css'
  import 'handsontable/dist/handsontable.full.css'
  
  
  import 'handsontable/dist/handsontable.full.css'
import { disabledTimeListsProps } from 'element-plus/es/components/time-picker/src/props/shared';
  
  
  
  export default{
    name:'addTeacher',
    data(){
      let self = this;
      return{

        editableTabsValue: '0',
        currenteditableTabsValue:0,
        maxeditableTabsValue:0,
        editableTabs: [],
        tabIndex: 0,




        colNum:1,
        over25:Boolean,
        activityList:[],
        departmentId:'',
        schoolId:'',
        courseId:'',
        detailId:'',
        currentNumberofActivities:0,
  
        firstActivities:true,
  
        
        dirty:false,
        saving:false,
        count:0,
        localres:{},
        postData: { activities: {
          item:[],
          value:[],
          remark:[]
        }
          },
        db: { items: [] },
        departmentId:0,
        fromCourseBatchAdd:false,

      }
    },
    components:{
      ref, onMounted,reactive,HotTable,HotColumn,registerAllModules,ElTooltip,
      ElIcon,ElInput,Handsontable,Back , FolderChecked, InfoFilled, Loading, 
      Download, UploadFilled, DocumentAdd,ElMessage, ElMessageBox,Action
      ,CirclePlus,DocumentChecked
    },
    methods:{
      editableTabsValueChange(pane){
        
        let that = this;
        this.currenteditableTabsValue = Number(pane.props.name);
        this.hotInstance.updateSettings({
                data:that.db.items[that.currenteditableTabsValue-1],
              });
        return console.log('currenteditableTabsValue:',Number(pane.props.name));
        
        
      },
      handleTabsEdit(targetName, action) {
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
          this.currenteditableTabsValue = this.tabIndex;
          this.maxeditableTabsValue = this.tabIndex;
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: '成绩项'+' '+newTabName,
            name: newTabName.toString(),
            value: newTabName
          });
          this.editableTabsValue = newTabName.toString();
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
      addActivities(){
        // this.iscolover25();
        if(this.colNum<25){
        this.firstActivities = false;
       
        if(!this.currenteditableTabsValue){
        this.db.items[this.currenteditableTabsValue][0].push('');
        this.db.items[this.currenteditableTabsValue][1].push(null);
        this.db.items[this.currenteditableTabsValue][2].push('');
        this.db.items[this.currenteditableTabsValue][3].push('');
        this.hotInstance.updateSettings({
                data:this.db.items[this.currenteditableTabsValue],
              });
        }
        else{
        this.db.items[this.currenteditableTabsValue-1][0].push('');
        this.db.items[this.currenteditableTabsValue-1][1].push(null);
        this.db.items[this.currenteditableTabsValue-1][2].push('');
        this.db.items[this.currenteditableTabsValue-1][3].push('');
        this.hotInstance.updateSettings({
                data:this.db.items[this.currenteditableTabsValue-1],
              });
        
        }
        
        this.colNum = this.colNum+1;
        // this.dictTolist(this.db.items);
        
        }
        
       
      },
      activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
              this.courseId = this.$store.state.course.baseCourseCourseId;
              this.detailId = this.$store.state.course.detailId;
              this.activateHotcolumn();
              console.log('db items:',this.db.items);},
    activateHotcolumn(){
      let self = this;
      let that = this;
      this.getActivities().then(function(){
        let container = document.querySelector("#courseHot");
        // let container = this.$refs.courseHot;
        let hotRegisterer = new Handsontable(container,{
            data: self.db.items[0],
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: false,
            dragToScroll: true,
            rowHeaders: ['成绩项', '分值','设置','权重'],
            copyPaste: true,
            colWidths: 70,
            allowRemoveColumn: true,
            
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
            },afterChange(changes, source) {
          if (source === "loadData") {
            console.log("same");
            return;
          } else {
            self.isValid();
            if (self.count == 0) {
              self.dirty = false;
              console.log("console:", self.count,"dirty", self.dirty,'items:',self.db.items);
            } else {
              self.dirty = true;
              self.firstActivities = false;
              console.log("console:", self.count,"dirty", self.dirty,'items:',self.db.items,'firstActivities',self.firstActivities);
            }
            self.count++;
            console.log("console:", self.count);
          }
        },
        afterRemoveCol(changes, source){
          self.firstActivities = false;
        }
        });

        that.hotInstance = hotRegisterer;
        that.hotInstance.updateSettings({
                data:that.db.items[0],
                cells: that.getHotCellsFunction(),
              });
      })
    },
    getHotCellsFunction() {
                
                return function (row, col, prop) {  // http://docs.handsontable.com/0.16.0/tutorial-cell-types.html
                  var cellProperties = {};
                  let that = this;
                  if (row === 2) {
                    cellProperties.type = 'dropdown';
                    cellProperties.source = [' ','总评','期末'];
                    cellProperties.allowEmpty = true;
                    cellProperties.className = 'ht-s-size';
                    //   cellProperties.validator = that.validScoreSetting();
                    }
                  if(row === 3){
                    cellProperties.allowEmpty = false;
                  }
                    return cellProperties;
                };
        },
  async getActivities(){
      let that = this;
      return request({
        url:'/detail/'+this.detailId,
        method:'get',
      }).then(function(res){
        console.log('activities',res);
       
        let course = res.data;
        if(course.activities.length){
          // that.tabIndex = course.activities.length;
          
          course.activities.forEach((activity)=>{
            that.handleTabsEdit(1,'add');
            let tempdata = []
            tempdata.push(activity.item);
            tempdata.push(activity.value);
            tempdata.push(activity.remark);
            if(!activity.weight){
              let templist =[]
              for(let i=0;i<activity.item.length;i++){
                templist.push('');
              }
              tempdata.push(templist);
            }
            else{
              tempdata.push(activity.weight);
            }
            that.db.items.push(tempdata);
          })
         
           
          // that.db.items.push(course.activities.item);
          // that.db.items.push(course.activities.value);
          // that.db.items.push(course.activities.remark);
          that.editableTabsValue = '1';
          that.currenteditableTabsValue = 1;
          console.log('res has activities:',that.db.items);
        }
        else {
          console.log('res has no activities');
          that.handleTabsEdit(1,'add');
          let item = ['']
          let value = ['']
          let remark = ['']
          let weight = ['']
          let tempdata =[]
          tempdata.push(item);
          tempdata.push(value);
          tempdata.push(remark);
          tempdata.push(weight);
          that.db.items.push(tempdata);
         
          }
      })
    },
    isValid(){
        if(this.firstActivities){
        console.log('isValid:this.firstActivities:',this.firstActivities)
        return false;
      }
        else{
          var result = this.toPostData();
          
          return !(!result);
      }
      
      
      
    },
    isNotDirty(){
      this.dirty=false;
    },
    save() {
      let that = this;
      this.saving = true;
      this.dirty = false;
      var result = this.isValid();
        if (!result) {
          this.saving = false;
          return;
        }
      let keyNum = [];
      for(let i=0;i<Object.keys(this.editableTabs).length;i++){
        keyNum.push(Number(this.editableTabs[i]['name'])-1);
      }

      let activities=[];
      
      
      
     
      for(let i=0;i<keyNum.length;i++){
        // if(typeof(this.db.items[1][i]) == 'string'){
        //   this.db.items[1][i] = parseInt(this.db.items[1][i]);
        // }
        let tempitem = [];
        let tempvalue = [];
        let tempremark = [];
        let tempweight = [];
        console.log('keyNum[i]:',keyNum[i]);
        for(let j=0;j<this.db.items[keyNum[i]][0].length;j++){
          tempitem.push(this.db.items[keyNum[i]][0][j]);
          tempvalue.push(this.db.items[keyNum[i]][1][j]);
          tempremark.push(this.db.items[keyNum[i]][2][j]);
          tempweight.push(this.db.items[keyNum[i]][3][j]);
        }
        let dict ={
          item:tempitem,
          value:tempvalue,
          remark:tempremark,
          weight:tempweight
        }
        activities.push(dict);
      }
    
      console.log('activities data :',activities);
      return request({
        url:'/detail',
        method:'put',
        data:{
        'schoolId':this.schoolId,
        'departmentId': this.departmentId,
        'courseId':this.courseId,
        'detailId':this.detailId,
        "activities": activities,
      }
      }).then(function(res){
        
        that.firstActivities = true;
        console.log('res:',res);
        // that.getActivities();
        if(res.code == 'SUCCESS'){
          ElMessage({
                type: 'success',
                message: `添加成功`,
                duration:1000,
              });
        }
        else{
          ElMessage({
                  type: 'error',
                  message: `添加失败`,
                  duration:1000,
                });
        }
      }).catch((e)=>{
        console.log('e:',e);
        if(e.code == 'UNPROCESSABLE_ENTITY'&&e.msg == '总评未设置'){
          ElMessage({
                  type: 'error',
                  message: `总评未设置`,
                  duration:1500,
                });
        }
        if(e.code == 'UNPROCESSABLE_ENTITY'&&e.msg == '有权重为空'){
          ElMessage({
                  type: 'error',
                  message: `有权重为空`,
                  duration:1500,
                });
        }
        if(e.code == 'UNPROCESSABLE_ENTITY'&&e.msg == '权重和不对'){
          ElMessage({
                  type: 'error',
                  message: `权重和不对`,
                  duration:1500,
                });
        }
      })
  },
    toPostData(){
      
      this.postData.activities.length = 0; // clean array
     
      var valid = true;
        
        if(!this.currenteditableTabsValue){
          let length =this.db.items[this.currenteditableTabsValue][0].length;
        }
        else{
          let length =this.db.items[this.currenteditableTabsValue-1][0].length;
        }
        
        // let count=0;
        // let hasremark=false;
        // for(let i=0;i<length;i++){
        //   if(this.db.item[2][i.toString()]){
        //     count++;
        //   }
        // }
        // if(count){
        //   hasremark=true;
        // }
          for(let i=0;i<length;i++){
            if (!this.db.items[this.currenteditableTabsValue-1][i][0] 
            ||!this.db.items[this.currenteditableTabsValue-1][i][1]
            ||!this.db.items[this.currenteditableTabsValue-1][i][3]) {
              
              valid = false;
              break;
          } 
          }

       
        return valid;
    },
  goBackandClean(){
    this.db.items = [];
    this.postData.activities = [];
    
    console.log('datas:', this.db.items,this.postData.activities);
    this.reload();
    
  },
  gobaseCourseDetail(){
    console.log('gobaseCourseDetail:'+this.saving+this.dirty);
    
    
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
        this.$router.push({ path:'/baseCourseDetail'});
      })
      .catch(() => {
        
      })
    }
    else{
      
      this.$router.push({ path:'/baseCourseDetail'});
    
    }
  },
  
  
    },
    mounted:function(){
      this.activate();
    },
   
  
    
    
  
  
  }
  
  
   
  </script>
  
  <style  scoped>
  .activity-tab{
    margin-top: 10%;
    width:80%;
    margin-left: 10%;
  }
  .card{
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 50px 20px;
  }
  .hot-table-container{
    float: left;
    height:100px;
    margin-left: 10%;
    
  }
.divider {
  margin-left: 20px;
  height: 24px;
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
  .block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
  .hotTable{
    box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
  }
  .md-padding{
    margin-top: 10%;
    height: 80%;
  }
  .ng-scope layout-column flex{
  display: flex;
  flex-direction: column;
  }

 
  
 
  
  
  </style>
  