<template>
  <div layout="column" flex class="ng-scope layout-column flex" v-if="isRouterAlive">
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
      :disabled="!isValid()" >
        <el-icon
          
          size="22px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px;top:-4px;"
          
        >
        <!-- :disabled="!isValid()" -->
          <FolderChecked />
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
        <el-icon
          class="icon"
          size="22px"
          color="rgb(137, 137, 137)"
          style="margin-left: 20px"
          @click="addActivities"
        >
          <CirclePlus />
        </el-icon>
      </el-tooltip>

    </el-row>
  </div>



      
  
      <div layout="row" flex class="md-padding" >
        <div class="hot-table-container" layout="column" flex layout-align="start center" >
        
        <hot-table :settings="hotSettings" v-model:data="db.items"  style="line-height: 100px;text-align: center;margin:auto" class="hotTable">
         
        </hot-table>
     
    </div>
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
        departmentId:'',
        schoolId:'',
        courseId:'',
        detailId:'',
        currentNumberofActivities:0,
  
        firstActivities:true,
  
        isRouterAlive:true,
        dirty:false,
        saving:false,
        count:0,
        localres:{},
        postData: { activities: {
          item:[],
          value:[],
        }
          },
        db: { items: [] },
        departmentId:0,
        fromCourseBatchAdd:false,

        hotSettings:{
        
        licenseKey: "non-commercial-and-evaluation",
        colHeaders: false,
        rowHeaders: true,
        rowHeaders: ['成绩项', '分值'],
        
      // minSpareRows: 0,
      // minSpareCols: 0,
        // preventOverflow: "horizontal",
        // manualColumnMove: false,
        copyPaste: true,
        colWidths: 52,  // same as .scss
        // copyRowsLimit: 2,
        maxRows: 2,
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
              console.log("console:", self.count,"dirty", self.dirty,'items:',self.db.items);
            }
            self.count++;
            console.log("console:", self.count);
          }
        },
        }

      }
    },
    components:{
      ref, onMounted,reactive,HotTable,HotColumn,registerAllModules,ElTooltip,
      ElIcon,ElInput,Handsontable,Back , FolderChecked, InfoFilled, Loading, 
      Download, UploadFilled, DocumentAdd,ElMessage, ElMessageBox,Action
      ,CirclePlus
    },
    methods:{
      addActivities(){
        this.firstActivities = false;
        let length = Object.keys(this.db.items[0]).length;
        
        this.db.items[0][length.toString()] = '';
        this.db.items[1][length.toString()] = null;
        
      },
      activate(){
              this.departmentId = this.$store.state.currentInfo.departmentId;
              this.schoolId = this.$store.state.currentInfo.schoolId;
              this.courseId = this.$store.state.course.baseCourseCourseId;
              this.detailId = this.$store.state.course.detailId;
              this.getActivities();
              console.log('db items:',this.db.items);},
    getActivities(){
      let that = this;
      return request({
        url:'/detail/'+this.detailId,
        method:'get',
      }).then(function(res){
        console.log('activities',res);
       
        let course = res.data;
        if(course.activities){
          let activityNumber = course.activities.item.length;
          that.currentNumberofActivities = activityNumber;
          
          var itemDict = {};
          var valueDict = {};
         for(let i=0;i<activityNumber;i++){
          itemDict[i.toString()] = course.activities.item[i];
          valueDict[i.toString()] = course.activities.value[i];
         }
           
          that.db.items.push(itemDict);
          that.db.items.push(valueDict);
          console.log('res has activities:',that.db.items);
        }
        else {
          console.log('res has no activities');
          var itemDict = {'0':''};
          var valueDict = {'0':''};
          that.db.items.push(itemDict);
          that.db.items.push(valueDict);
              // add two columns (fail column, 1 score column)
              // that.addColumn();
              // that.addColumn();
          }
      })
    },
    addColumn() {
      for (var i = 0; i < this.db.items.length; i++) {
        this.db.items[i].push('');
      }
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
      let length = Object.keys(this.db.items[0]).length;
     
      for(let i=0;i<length;i++){
        if(typeof(this.db.items[1][i.toString()]) == 'string'){
          this.db.items[1][i.toString()] = parseInt(this.db.items[1][i.toString()]);
        }
        item.push(this.db.items[0][i.toString()]);
        value.push(this.db.items[1][i.toString()]);
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
        "value": value
  },}
      }).then(function(res){
        
        that.firstActivities = true;
        
        that.getActivities();
        if(res.code == 200){
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
        
        
        let length = Object.keys(this.db.items[0]).length;
          for(let i=0;i<length;i++){
            if (!this.db.items[0][i.toString()] ||!this.db.items[1][i.toString()] ) {
              
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
  reload(){
    this.isRouterAlive = false;
    this.count = 0;
    this.$nextTick(function () {
      this.isRouterAlive = true;
    });
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
  }
  .ng-scope layout-column flex{
  display: flex;
  flex-direction: column;
  }

 
  
 
  
  
  </style>
  