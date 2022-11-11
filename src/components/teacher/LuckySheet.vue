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
