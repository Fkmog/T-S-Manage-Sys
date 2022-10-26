<template>
  <div layout="column" flex class="ng-scope layout-column flex">
    <div class="submenu no-select ng-scope layout-align-center-center layout-row" layout="row" layout-align="center center" style="justify-content: left">
      <el-icon class="searchicon"><Search /></el-icon>
        <el-input
        v-model="form.queryString"
        class="elinput"
        placeholder="搜索姓名、工号"
        v-on:keyup.enter="onSubmit"
      />
     
        <el-icon class="closeicon" @click="clearqueryString" v-show="checkqueryString"><Close /></el-icon>

      
      
    </div>

    <div layout="row" flex class="md-padding" >
      <div class="hot-table-container" layout="column" flex layout-align="start center" >
        <hot-table :settings="hotSettings"  width="650" style="line-height: 100px;text-align: center;margin:auto">
            <hot-column  title="工号" width="200" height="20"></hot-column>
            <hot-column  title="姓名" width="200" height="20"></hot-column>
            <hot-column  title="邮箱" width="200" height="20"></hot-column>
        </hot-table>
        <!-- <LuckySheet /> -->
      </div>

   

   </div>
  </div>
</template>

<script>
import { ref,reactive}from 'vue';
import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { ElTooltip,ElIcon,ElInput,ElForm, ElButton } from 'element-plus'

    
import { Back , FolderChecked, InfoFilled, Loading, Search, Close} from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'


import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题

registerAllModules();

export default {
    name:"Teacher",
    setup(){
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
      // let fromCourseBatchAdd = ref(false);
      const searchteacherdata = ref('');
      const form = reactive({
       queryString:''
      });
      const onSubmit = () => {
        alert('submit!')
      };
      const clearqueryString = () => {
        form.queryString=''
      };
      const checkqueryString = () => {
        if(form.queryString!=''){
          return true
        }
        else
          return false
      };

      return {hotSettings,searchteacherdata,form,onSubmit,clearqueryString,checkqueryString}
    },
  components: {
    HotTable,HotColumn,ElTooltip,ElIcon,Back,FolderChecked,InfoFilled,Loading,Search,ElInput,ElForm,Close,ElButton
  },
  methods:{
    onClickClose (ev) {
      
      console.log('返回')
    },
    save(){
      console.log('保存1')
    }
  }
}
</script>

<style>
body {
    font-family: Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif;
    background-color: #f2f2f2;
}




html {
    font-family: 'Roboto Slab', serif;
}


[layout=row] {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
}


.searchicon{
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}
.closeicon{
  margin: 0 6px;
  height: 40px;
  line-height: 24px;
  padding: 8px;
  width: 40px;
}

.el-icon svg{
  height: 20px;
  width: 20px;
}
.elinput{
  width: 20%;
  
}
.elinput:hover {
    border-color: #5c6bc0!important;
    color: #5c6bc0;
    width: 20%;
}
.searchform{
  width: 100%;
}

.submenu {
    color: #3f51b5;
    font-size: 14px;
    font-weight: 500;
    height: 48px;
    min-height: 48px;
    line-height: 1em;
    margin: 0;
    position: relative;
    padding: 6px 96px 5px 32px;
    border-bottom: 1px solid #d0d0d0;
    background-color: #f2f2f2;
}

.submenu .s-v-bar {
    background: #d0d0d0;
    cursor: default;
    height: 24px;
    margin: 0 6px;
    width: 1px;
}

.md-icon-button {
    margin: 0 6px;
    height: 40px;
    min-width: 0;
    line-height: 24px;
    padding: 8px;
    width: 40px;
    border-radius: 50%;
}

.md-button.md-icon-button {
    margin: 0 6px;
    height: 40px;
    min-width: 0;
    line-height: 24px;
    padding: 8px;
    width: 40px;
    border-radius: 50%;
}

.yw-unclickable {
    cursor: auto;
}

.layout, .layout-column, .layout-row {
    box-sizing: border-box;
    display: flex;
}

.layout-align-center-center, .layout-align-end-center, .layout-align-space-around-center, .layout-align-space-between-center, .layout-align-start-center {
    align-items: center;
    align-content: center;
    max-width: 100%;
}

.layout-align-center, .layout-align-center-center, .layout-align-center-end, .layout-align-center-start, .layout-align-center-stretch {
    justify-content: center;
}

.layout-column {
    flex-direction: column;
}

.flex {
    flex: 1;
}
.layout-row>.flex {
    min-width: 0;
}

.el-button {
    
        display: inline-block;
        position: relative;
        cursor: pointer;
        min-height: 36px;
        min-width: 88px;
        line-height: 36px;
        vertical-align: middle;
        align-items: center;
        text-align: center;
        border-radius: 2px;
        box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        border: 0;
        padding: 0 6px;
        margin: 6px 8px;
        background: transparent;
        color: currentColor;
        white-space: nowrap;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 14px;
        font-style: inherit;
        font-variant: inherit;
        font-family: inherit;
        text-decoration: none;
        overflow: hidden;
        transition: box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1);
    
}
</style>