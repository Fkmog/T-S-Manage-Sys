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



      
  
     

      <div  flex class="md-padding">
          <div class="hot-table-container"  id="courseHot"></div>
        </div>
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
      addActivities(){
        // this.iscolover25();
        if(this.colNum<25){
        this.firstActivities = false;
        
        
        this.db.items[0].push('');
        this.db.items[1].push(null);
        this.db.items[2].push('');
        this.colNum = this.colNum+1;
        // this.dictTolist(this.db.items);
        this.hotInstance.updateSettings({
                data:this.db.items,
              });
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
        let hotRegisterer = new Handsontable(container,{
            data: self.db.items,
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: false,
            dragToScroll: true,
            rowHeaders: ['成绩项', '分值','设置'],
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
                data:that.db.items,
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
                    return cellProperties;
                };
        },
    getActivities(){
      let that = this;
      return request({
        url:'/detail/'+this.detailId,
        method:'get',
      }).then(function(res){
        console.log('activities',res);
       
        let course = res.data;
        if(course.activities){
            
         
           
          that.db.items.push(course.activities.item);
          that.db.items.push(course.activities.value);
          that.db.items.push(course.activities.remark);
          console.log('res has activities:',that.db.items);
        }
        else {
          console.log('res has no activities');
          let item = ['']
          let value = ['']
          let remark = ['']
          that.db.items.push(item);
          that.db.items.push(value);
          that.db.items.push(remark);
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
    
      
      let item = [];
      let value = [];
      let remark = [];
      let length = this.db.items[0].length;
     
      for(let i=0;i<length;i++){
        // if(typeof(this.db.items[1][i]) == 'string'){
        //   this.db.items[1][i] = parseInt(this.db.items[1][i]);
        // }
        item.push(this.db.items[0][i]);
        value.push(this.db.items[1][i]);
        remark.push(this.db.items[2][i])
      }
    

      return request({
        url:'/detail',
        method:'put',
        data:{
        'schoolId':this.schoolId,
        'departmentId': this.departmentId,
        'courseId':this.courseId,
        'detailId':this.detailId,
        "activities": {
        "item": item,
        "value": value,
        "remark":remark,
  },}
      }).then(function(res){
        
        that.firstActivities = true;
        
        that.getActivities();
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
      })
  },
    toPostData(){
      
      this.postData.activities.length = 0; // clean array
     
      var valid = true;
        
        
        let length =this.db.items[0].length;
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
            if (!this.db.items[0][i] ||!this.db.items[1][i]) {
              
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
  .hot-table-container{
    float: left;
    margin-left: 5%;
    
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
  