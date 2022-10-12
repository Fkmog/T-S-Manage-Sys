<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

  <hot-table :data="data" :rowHeaders="true" :colHeaders="true" :licenseKey="licenseKey"></hot-table>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题
import { registerAllModules } from 'handsontable/registry';


registerAllModules();

export default {
  name: 'App',
  components: {
    HotTable
  },
data(){
  return{
    data:[
    ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
          ['2016', 10, 11, 12, 13],
          ['2017', 20, 11, 14, 13],
          ['2018', 30, 15, 12, 13]
    ],
    licenseKey:'non-commercial-and-evaluation'
  };
},
}





</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
