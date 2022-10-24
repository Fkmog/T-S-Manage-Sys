<template>


<div layout="column" flex class="ng-scope layout-column flex">
    <div class="submenu no-select layout-align-center-center layout-row" layout="row" layout-align="center center" style="justify-content: left">
      <el-tooltip content="返回">
        <el-button class="md-icon-button button-back" md-no-ink aria-label="返回" @click="onClickClose" link>
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
      <el-button class="md-icon-button yw-unclickable" aria-label="帮助" link>
        <el-icon><InfoFilled /></el-icon>
      </el-button>
      <div layout="row" layout-align="center center">
        <span>可直接从excel拷贝；可拖动列的顺序；学院最多可添加500个教师</span>
      </div>
      <div flex></div>
      <div style="position: absolute; top: 0">
        <input id="uploadBtn" type="file" @change="loadExcel" />

        <span>Or Load remote xlsx file:</span>

        <select v-model="selected" @change="selectExcel">
          <option disabled value="">Choose</option>
          <option v-for="option in options" :key="option.text" :value="option.value">
            {{ option.text }}
          </option>
        </select>

        <a href="javascript:void(0)" @click="downloadExcel">Download source xlsx file</a>
      </div>
    </div>

    <div layout="row" flex class="md-padding" >
      <div class="hot-table-container" layout="column" flex layout-align="start center" >
        <!-- <hot-table :settings="hotSettings"  width="650" style="line-height: 100px;text-align: center;margin:auto">
            <hot-column  title="工号" width="200" height="20"></hot-column>
            <hot-column  title="姓名" width="200" height="20"></hot-column>
            <hot-column  title="邮箱" width="200" height="20"></hot-column>
        </hot-table> -->
        <!-- <LuckySheet /> -->
        <div id="luckysheet"></div>
        <div v-show="isMaskShow" id="tip">Downloading</div>
      </div>
    </div>
  </div>



  




  
</template>

<script setup>
import { ref, onMounted,} from 'vue'
import { exportExcel } from './export'
import LuckyExcel from 'luckyexcel'

import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { ElTooltip,ElIcon } from 'element-plus'

import '../assets/style.css'
import 'element-plus/dist/index.css'
import 'handsontable/dist/handsontable.full.css'


import { Back , FolderChecked, InfoFilled, Loading} from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'

import '../assets/style.css'

import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题


const isMaskShow = ref(false)
const selected = ref('')
const jsonData = ref({})
const options = ref([
  { text: 'Money Manager.xlsx', value: 'https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx' },
  {
    text: 'Activity costs tracker.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx'
  },
  {
    text: 'House cleaning checklist.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx'
  },
  {
    text: 'Student assignment planner.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx'
  },
  {
    text: 'Credit card tracker.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx'
  },
  { text: 'Blue timesheet.xlsx', value: 'https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx' },
  {
    text: 'Student calendar (Mon).xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx'
  },
  {
    text: 'Blue mileage and expense report.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx'
  }
])

const loadExcel = (evt) => {
  const files = evt.target.files
  if (files == null || files.length == 0) {
    alert('No files wait for import')
    return
  }

  let name = files[0].name
  let suffixArr = name.split('.'),
    suffix = suffixArr[suffixArr.length - 1]
  if (suffix != 'xlsx') {
    alert('Currently only supports the import of xlsx files')
    return
  }
  LuckyExcel.transformExcelToLucky(files[0], function (exportJson, luckysheetfile) {
    if (exportJson.sheets == null || exportJson.sheets.length == 0) {
      alert('Failed to read the content of the excel file, currently does not support xls files!')
      return
    }
    console.log('exportJson', exportJson)
    jsonData.value = exportJson

    window.luckysheet.destroy()

    window.luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar: false,
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    })
  })
}
const selectExcel = (evt) => {
  const value = selected.value
  const name = evt.target.options[evt.target.selectedIndex].innerText

  if (value == '') {
    return
  }
  isMaskShow.value = true

  LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {
    if (exportJson.sheets == null || exportJson.sheets.length == 0) {
      alert('Failed to read the content of the excel file, currently does not support xls files!')
      return
    }
    console.log('exportJson', exportJson)
    jsonData.value = exportJson

    isMaskShow.value = false
    window.luckysheet.destroy()

    window.luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar: false,
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    })
  })
}
const downloadExcel = () => {
  // const value = selected.value;;
  //
  // if(value.length==0){
  //     alert("Please select a demo file");
  //     return;
  // }
  //
  // var elemIF = document.getElementById("Lucky-download-frame");
  // if(elemIF==null){
  //     elemIF = document.createElement("iframe");
  //     elemIF.style.display = "none";
  //     elemIF.id = "Lucky-download-frame";
  //     document.body.appendChild(elemIF);
  // }
  // elemIF.src = value;
  exportExcel(luckysheet.getAllSheets(), '下载')
}

// !!! create luckysheet after mounted
onMounted(() => {
  luckysheet.create({
        container: 'luckysheet', // luckysheet为容器id
        lang: 'zh',
        showinfobar: false, // 标题部分信息
        showsheetbar: false, // 底部sheet页
        sheetFormulaBar: true, // 是否显示公示栏
        showstatisticBar: false, // 自定义计数栏
        showtoolbar: false, // 默认工具栏都不显示
        enableAddRow: false, // 底部添加行按钮
        showtoolbarConfig: { // 自定义配置工具栏
          undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
          paintFormat: true, // 格式刷
          mergeCell: true // '合并单元格'
        },
        cellRightClickConfig: { // 自定义右键单元格
          insertColumn: false,
          deleteColumn: false,
          hideRow: false,
          hideColumn: false,
          deleteCell: false,
          sort: false,
          filter: false, // 筛选选区
          chart: false, // 图表生成
          image: false, // 插入图片
          link: false, // 插入链接
          data: false,
          matrix: false
        },
        enableAddBackTop: true

  })
})


</script>

<style  scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}

#uploadBtn {
  font-size: 16px;
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
