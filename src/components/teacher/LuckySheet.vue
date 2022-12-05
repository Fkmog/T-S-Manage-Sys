<<<<<<< HEAD
<template>
<div layout="column" flex class="ng-scope layout-column flex">
    <div class="submenu no-select layout-align-center-center layout-row" layout="row" layout-align="center center" style="justify-content: left">
      <el-tooltip content="返回">
        <el-button class="md-icon-button button-back" md-no-ink aria-label="返回" @click="go" link>
        <el-icon><Back /></el-icon>
      </el-button>
      </el-tooltip>
      <div class="s-v-bar">&nbsp;</div>
      <el-tooltip content="保存">
        <el-button class="md-icon-button" aria-label="保存" @click="save" link>
          <el-icon><FolderChecked /></el-icon>
        </el-button>  
      </el-tooltip>
      <el-button class="md-icon-button yw-unclickable" aria-label="加载中"  disabled link>
        <el-icon class="is-loading" >
          <Loading />
        </el-icon>
      </el-button>
          <div class="s-v-bar">&nbsp;</div>
      <el-button class="md-icon-button yw-unclickable" aria-label="帮助" link>
        <el-icon><InfoFilled /></el-icon>
      </el-button>
      <div layout="row" layout-align="center center">
        <span>可直接从excel拷贝；可拖动列的顺序；学院最多可添加500个教师</span>
      </div>
      <div flex></div>
    </div>

    <div layout="row" flex class="md-padding" >
      <div class="hot-table-container" layout="column" flex layout-align="start center" >
        <hot-table :settings="hotSettings"  width="650" style="line-height: 100px;text-align: center;margin:auto">
            <hot-column  title="工号" width="200" height="20" ></hot-column>
            <hot-column  title="姓名" width="200" height="20" ></hot-column>
            <hot-column  title="邮箱" width="200" height="20" ></hot-column>
        </hot-table>
        <!-- <LuckySheet /> -->
      </div>
    </div>
  </div>



  




  
</template>

<script setup>
import { ref, onMounted,} from 'vue'
import { useRouter } from 'vue-router';


import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { ElTooltip,ElIcon,ElInput } from 'element-plus'

import '@/assets/style.css'
import 'element-plus/dist/index.css'
import 'handsontable/dist/handsontable.full.css'


import { Back , FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd} from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'



import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题


const isMaskShow = ref(false)
const selected = ref('')
const jsonData = ref({})
const save = () => {
  console.log('保存')
}
const $router = useRouter();

const hotSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        rowHeaders: true,
        minSpareRows: 1,
        preventOverflow: 'horizontal',
        manualColumnMove: true,
        // copyRowsLimit: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,  // TODO: minus current #teachers in department
        // maxRows: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,
        // contextMenu: ['row_above', 'row_below', 'remove_row'],
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
        },};
function go(){
  $router.push({ path:'/teacher'})  //没有this
}
</script>

<style  scoped>
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
.luckysheetborder{
  border: 1px aquamarine;
}

#uploadBtn {
  font-size: 16px;
}
.el-input{
  width: 30%;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
=======
<template>
<div layout="column" flex class="ng-scope layout-column flex" v-if="isRouterAlive">
    <div class="submenu no-select layout-align-center-center layout-row" layout="row" layout-align="center center" style="justify-content: left">
      <el-tooltip content="返回">
        <el-button class="md-icon-button button-back" md-no-ink aria-label="返回" @click="goTeacher" link>
        <el-icon><Back /></el-icon>
      </el-button>
      </el-tooltip>
      <div class="s-v-bar">&nbsp;</div>
      <el-tooltip content="保存">
        <el-button class="md-icon-button" aria-label="保存" @click="save" link :disabled="!isValid()">
          <el-icon><FolderChecked /></el-icon>
        </el-button>  
      </el-tooltip>
      <!--  -->
          <div class="s-v-bar">&nbsp;</div>
      <el-button class="md-icon-button yw-unclickable" aria-label="帮助" link>
        <el-icon><InfoFilled /></el-icon>
      </el-button>
      <div layout="row" layout-align="center center">
        <span>可直接从excel拷贝；可拖动列的顺序；学院最多可添加500个教师</span>
      </div>
      <div flex></div>
    </div>

    <div layout="row" flex class="md-padding" >
      <div class="hot-table-container" layout="column" flex layout-align="start center" >
        
          <hot-table :settings="hotSettings" v-model:data="db.items" width="650" style="line-height: 100px;text-align: center;margin:auto" >
            <hot-column  data="teacherNumber" title="工号" width="200" height="20" ></hot-column>
            <hot-column  data="teacherName" title="姓名" width="200" height="20" ></hot-column>
            <hot-column  data="email" title="邮箱" width="200" height="20" validator="emailcheck" ></hot-column>
          </hot-table>
        <!-- <LuckySheet /> -->
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

import { Back , FolderChecked, InfoFilled, Loading, Download, UploadFilled, DocumentAdd} from '@element-plus/icons-vue'
import Handsontable from 'handsontable';
import request from '@/utils/request/request'
import '@/components/teacher/addTeacher.js'

import '@/assets/style.css'
import 'element-plus/dist/index.css'
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
      isRouterAlive:true,
      dirty:false,
      saving:false,
      count:0,
      localres:{},
      postData: { teachers: [] },
      db: { items: [] },
      departmentId:0,
      fromCourseBatchAdd:false,
      hotSettings:{
        // data:{id:222050308,name:'切·格瓦拉',email:'1073638314@qq.com',},
        
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        rowHeaders: true,
        minSpareRows: 1,
        preventOverflow: 'horizontal',
        manualColumnMove: true,
        // copyRowsLimit: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,  // TODO: minus current #teachers in department
        // maxRows: settings.MAX_TEACHERS_IN_ONE_DEPARTMENT,
        // contextMenu: ['row_above', 'row_below', 'remove_row'],
        // columns:[
        //   {type: 'numeric',},
        //   {type:'text'},
        //   {allowInvalid: false}
        // ],
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
            if(self.count==0){
              self.dirty=false;
              console.log('console:',self.count);
              console.log('different',self.dirty);
            }
            else{
              self.dirty=true;
              console.log('console:',self.count);
              console.log('different',self.dirty);
            }
            self.count++;
            console.log('console:',self.count);
            
            }
        }},
         

    }
  },
  components:{
    ref, onMounted,reactive,HotTable,HotColumn,registerAllModules,ElTooltip,
    ElIcon,ElInput,Handsontable,Back , FolderChecked, InfoFilled, Loading, 
    Download, UploadFilled, DocumentAdd,ElMessage, ElMessageBox,Action
  },
  methods:{
  isValid(){
    var result = this.toPostData();
      if (!result) {
        return false;
      } else {
        return this.postData.teachers.length > 0;
      }
  },
  isNotDirty(){
    
    this.dirty=false;
  },
  save() {
    this.saving = true;
    var result = this.isValid();
      if (!result) {
        this.saving = false;
        return;
      }
   
    if (!this.postData.teachers || this.postData.teachers.length <= 0) {
          return $q.reject('工号或姓名不能为空');
        }
        // var postData = {
        //   teachers:  this.postData.teachers,
        //   // departmentId: this.departmentId
        // };
        var teacherList = [];

        this.postData.teachers.forEach(function(teacher){
          teacherList.push(teacher);
        });
        console.log('teacherList:',teacherList);
        // return service.post(postData).then(function(res) {
        //   return res;
        // });
        let that =this;
        
        
        this.addTeacher(teacherList).then(function(res){
          console.log('res:',res);
          
          if(res.code == '200'){
            ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: (action) => {
              ElMessage({
                type: 'success',
                message: `添加成功`,
              })
              
            },
          });
            that.isNotDirty();
            that.goBackandClean();}
         else{
          ElMessageBox.alert(res.msg, 'Code:'+res.code, {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            callback: (action) => {
              ElMessage({
                type: 'error',
                message: `添加失败`,
              })
            },
          });
          that.goBackandClean();
    }
        });


      
  
},
  toPostData(){
    this.postData.teachers.length = 0; // clean array
    var res = this.postData.teachers;
      var valid = true;
      this.db.items.forEach(function (teacher) {
        teacher.teacherNumber = (_.isEmpty(teacher.teacherNumber)) ? '' : teacher.teacherNumber.trim();
        
        teacher.teacherName = (_.isEmpty(teacher.teacherName)) ? '' : teacher.teacherName.trim();
        teacher.email = (_.isEmpty(teacher.email)) ? '' : teacher.email.trim();

        if (_.isEmpty(teacher.teacherNumber) || _.isEmpty(teacher.teacherName) || _.isEmpty(teacher.email)) {
          if (_.isEmpty(teacher.teacherNumber) && _.isEmpty(teacher.teacherName) && _.isEmpty(teacher.email)) {
            return;
          } else {  // either name OR teacherNo is empty, but not both
            valid = false;
            return;
          }
        } else {  // both are not empty: post
          var distTeacher = {
            'teacherNumber':teacher.teacherNumber,
            'email':teacher.email,
            'teacherName':teacher.teacherName
          }
          res.push(distTeacher);
        }
      });

      return valid;
  },
goBackandClean(){
  this.db.items = [];
  this.postData.teachers = [];
  
  console.log('datas:', this.db.items,this.postData.teachers);
  this.reload();
  
},
reload(){
  this.isRouterAlive = false;
  this.count = 0;
  this.$nextTick(function () {
    this.isRouterAlive = true;
  });
},
goTeacher(){
  console.log('goteacher:'+this.saving+this.dirty);
  
  
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
      this.$router.push({ path:'/teacher'});
    })
    .catch(() => {
      
    })
  }
  else{
    
    this.$router.push({ path:'/teacher'});
  
  }
},
addTeacher(postData){
  var localres;
  console.log('postData:',postData);
  return request({
            url:'/teacher/addTeacher',
            method:'post',
            data:postData
        }).then(function(res){
          localres = res;
          console.log('localres',localres);
          return localres;
        });
},

  },
  onMounted:{
    
  },
 

  
  


}


 
</script>

<style  scoped>
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
.luckysheetborder{
  border: 1px aquamarine;
}

#uploadBtn {
  font-size: 16px;
}
.el-input{
  width: 30%;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
>>>>>>> fa38d9b5595107107946ca49e583d9f4995e52e2
