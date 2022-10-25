<template>
  <div>
    <router-view/>
  </div>
</template>

<script>


import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题
import { registerAllModules } from 'handsontable/registry';


registerAllModules();

export default {
  name: 'App',
 
}





</script>

<style>

</style>
