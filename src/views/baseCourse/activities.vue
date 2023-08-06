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
      

    </el-row>
  </div>



  <!-- @tab-add="this.handleTabsEdit('','add')"   -->
  <el-tabs v-model="editableTabsValue" type="card" class="activity-tab" editable 

  @tab-click="editableTabsValueChange"
  @edit="handleTabsEdit"
  id="drag-tab"
  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      
   
    >
      <template v-slot="label">
          
        <span v-if="!item.inputFlag"
          style="display: inline-block;width: 200px;text-align: center;padding: 10px;">
            <el-icon 
              size="22px"
              color="rgb(137, 137, 137)"
              style="float: left;top: 4px;"
              @click="tabsContent(item,item.name)" 
              >
              <EditPen />
            </el-icon>
            {{item.title}}
        </span>
        
        <el-input v-else-if="!!item.inputFlag" :ref="`myInput${item.name}`"
            v-model="item.title" type="text" 
            style="display: inline-block;width: 200px;text-align: center;padding: 10px;font-size: large;"
            clearable
            @blur="item.inputFlag=false" />
            
        <!-- <el-input type="text" name="hiddenText" style="display: none;" /> -->
        <el-icon 
              size="22px"
              color="rgb(137, 137, 137)"
              v-show="!!item.inputFlag"
              style="padding-right: 30px;top: 6px;"
              @click="item.inputFlag=false"
              >
              <Checked />
        </el-icon>
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
            :disabled="!over21"
            style="padding: 10px;"
          >
            <el-icon
              size="22px"
              color="rgb(137, 137, 137)"
            >
              <CirclePlus />
            </el-icon>
          </el-button>
          </el-tooltip>
      </template>
  </el-tab-pane>
    
  </el-tabs>
  
  <div class="card-container">
    <div class="hot-table-container" id="courseHot"></div>  
  </div>
    

  

      





    </div>
  
    
  </template>
  
  <script >
  import { ref, onMounted,reactive} from 'vue'
  
  import { HotTable,HotColumn } from '@handsontable/vue3';
  import { registerAllModules } from 'handsontable/registry';
  import { ElTooltip,ElIcon,ElInput,ElMessage, ElMessageBox } from 'element-plus'
  import Sortable from "sortablejs";
  
  import   Action  from 'element-plus'
  
  import { Back ,CloseBold,Checked, EditPen,FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd,CirclePlus,DocumentChecked} from '@element-plus/icons-vue'
  import Handsontable from 'handsontable';
  import request from '@/utils/request/request'
 
  
  
  import 'element-plus/dist/index.css'
  import 'handsontable/dist/handsontable.full.css'
  
  
  import 'handsontable/dist/handsontable.full.css'
import { disabledTimeListsProps } from 'element-plus/es/components/time-picker/src/props/shared';
  
  
  
  export default{
    name:'addTeacher',
    data(){
      let that = this;
      return{

        //角色信息
        identity: "",

        itemOrValueisEmpty:false,

        sortable:'',
        tempEditabel:'',
        oldtempEditabel:'',

        editableTabsValue: '0',
        currenteditableTabsValue:0,
        maxeditableTabsValue:0,
        editableTabs: [],
        tabIndex: 0,
        




        colNum:1,
        over21:Boolean,
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
      ,CirclePlus,DocumentChecked,Sortable,EditPen,Checked,CloseBold
    },
    methods:{
    dragTab(){
    let that = this;
    var tab = document.querySelector("#drag-tab .el-tabs__nav"); //获取需要拖拽的tab
    console.log('type of tab',typeof(tab),tab);
    // this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
    
    this.sortable = Sortable.create(tab, {
      //oldIIndex拖放前的位置， newIndex拖放后的位置 , editableTabs为遍历的tab签
      animation: 150,
      sort:true,
      onChoose({oldIndex}){
        let templist = JSON.parse(JSON.stringify(that.tempEditabel));
        that.oldtempEditabel = JSON.parse(JSON.stringify(that.tempEditabel));
        let currTab = templist[oldIndex];
        console.log('OnChoose currTab:',currTab);
        if(currTab['name']== '1'){
          that.sortable.option('sort',false);
        }
        else{
          that.sortable.option('sort',true);
        }

      },
      onMove:function (evt){
        console.log('evt.related.className',evt.related.id);
        if(evt.related.id == 'tab-1'){
          return false;
        }
      },
      onEnd({ newIndex, oldIndex }) {
        let currTab = that.tempEditabel.splice(oldIndex, 1)[0]; //鼠标拖拽当前的el-tabs-pane
       
          that.tempEditabel.splice(newIndex, 0, currTab); 
          that.editableTabs = that.tempEditabel;
          console.log('editableTabs:',that.editableTabs);
         
          that.currenteditableTabsValue = Number(that.editableTabsValue);
          that.hotInstance.updateSettings({
                  data:that.db.items[that.currenteditableTabsValue-1],
                });
         
      },
     
    });
},
    //tabs的双击可编辑   //双击表格可编辑存在input框问题(2023-04-19)
    tabsContent(val, index) {
          console.log(val, index, '双击编辑tabs');
          if(index == '1' && this.identity == '教师'){
            val.inputFlag = false;
            ElMessage({
              type: "error",
              message: "修改名称失败，没有权限",
              duration: 1500,
            });
          }
          else{
            val.inputFlag = true;
          }
      },
      editableTabsValueChange(pane){
        
        let that = this;
        this.currenteditableTabsValue = Number(pane.props.name);
        // if(this.currenteditableTabsValue ==1){
        //   this.sortable.option('sort',false);
        // }
        // else{
        //   this.sortable.option('sort',true);
        // }
          
        
        // let tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
        // console.log('this.tempEditabel:',tempEditabel);
        this.hotInstance.updateSettings({
                data:that.db.items[that.currenteditableTabsValue-1],
              });
        return console.log('currenteditableTabsValue:',Number(pane.props.name));
        
        
      },
      handleTabsEdit(targetName, action, activityName) {
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
            value: newTabName,
            inputFlag:false,
            
          });
          this.editableTabsValue = newTabName.toString();
          console.log('editableTabs after add ',this.editableTabs);
          this.hotInstance.updateSettings({
                data:that.db.items[that.currenteditableTabsValue-1],
              });
          this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue,'maxTabsValue:',this.maxeditableTabsValue);
        }
        if (action === 'add' && targetName ) {
          this.currenteditableTabsValue = this.tabIndex;
          this.maxeditableTabsValue = this.tabIndex;
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: (activityName ? activityName:'成绩项'+' '+newTabName),
            name: newTabName.toString(),
            value: newTabName,
            inputFlag:false,
            
          });
          console.log('editableTabs after add ',this.editableTabs);
          this.editableTabsValue = newTabName.toString();
          this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
          console.log('currenteditableTabsValue:',this.currenteditableTabsValue);
        }
        if (action === 'remove') {
          console.log('removing targetName:',targetName);
          if(targetName!='1'){
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
                this.tempEditabel = JSON.parse(JSON.stringify(this.editableTabs));
                console.log('editableTabs:',this.editableTabs);


            }).catch(e=>{
              console.log('e',e);
            })
          }
          else{
            ElMessageBox.confirm(
            '此成绩项为不可删除的',
            '注意',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
          }
      
          
        }
      },
      addActivities(){
        // this.iscolover21();
        this.colNum = this.db.items[this.currenteditableTabsValue-1][0].length;
        // console.log('colNum:',this.colNum);
        if(this.colNum<21){
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
        
        // this.colNum = this.colNum+1;
        // this.dictTolist(this.db.items);
        
        }
        
       
      },
      activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
              this.courseId = this.$store.state.course.baseCourseCourseId;
              this.identity = this.$store.state.currentInfo.identity;
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
            that.handleTabsEdit(1,'add',activity.name);
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
          
          that.dragTab();
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
      let keyName = [];
      for(let i=0;i<Object.keys(this.editableTabs).length;i++){
        keyNum.push(Number(this.editableTabs[i]['name'])-1);
        keyName.push(this.editableTabs[i]['title'])
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
        let tempname = keyName[i];
        console.log('keyNum[i]:',keyNum[i]);
        for(let j=0;j<this.db.items[keyNum[i]][0].length;j++){
          if(!this.db.items[keyNum[i]][0][j]){
            this.itemOrValueisEmpty = true;
          }
          if(!this.db.items[keyNum[i]][1][j]){
            this.itemOrValueisEmpty = true;
          }
          else{
            this.itemOrValueisEmpty = false;
          }
          tempitem.push(this.db.items[keyNum[i]][0][j]);
          tempvalue.push(this.db.items[keyNum[i]][1][j]);
          tempremark.push(this.db.items[keyNum[i]][2][j]);
          tempweight.push(this.db.items[keyNum[i]][3][j]);
        }
        let dict ={
          item:tempitem,
          value:tempvalue,
          remark:tempremark,
          weight:tempweight,
          name:tempname,
        }
        activities.push(dict);
      }
      

      console.log('activities data :',activities);
      if(this.itemOrValueisEmpty){
        ElMessage({
                type: 'error',
                message: `成绩项或者分值为空`,
                duration:1500,
              });
      }
      else{
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
      }
      
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
  :deep().el-tabs__new-tab{
    margin:10px;
  }
  .card-container{
    margin-left: 10%;
    width: 80%;
    height: 120px;
    background-color: white;
    box-shadow: 0px 1px 3px rgb(164, 163, 163);
  }
  .activity-tab{
    margin-top: 68px;
    background: white;
    box-shadow: 0px 1px 3px rgb(164, 163, 163);
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
    margin-top: 10px;
    margin-left: 10px;
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
  