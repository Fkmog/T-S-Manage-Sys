<template>
    <!-- 关系到数组的时候可以用hotdata -->
    <div id="example2">
  <hot-table :data="hotData" :settings="settings">
    <hot-column title="ID" data="id">
    </hot-column>
    <!-- 只读 -->
    <hot-column :settings="secondColumnSettings" read-only="true" data="name">
    </hot-column>
    <hot-column title="Price" data="payment.price">
    </hot-column>
    <hot-column title="Currency" data="payment.currency">
    </hot-column>
  </hot-table>
</div>
</template>

<script>
import { HotTable, HotColumn } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';//解决样式没有的问题


export default{
    name:"HT01",
    data(){
        return{
            // 数据赋值
        hotData: [
        { id: 1, name: 'Table tennis racket', payment: { price: 13, currency: 'PLN' } },
        { id: 2, name: 'Outdoor game ball', payment: { price: 14, currency: 'USD' } },
        { id: 3, name: 'Mountain bike', payment: { price: 300, currency: 'USD' } }
      ],
      secondColumnSettings: {
        title: 'Second column header'
      },
      settings: {
        height: 'auto',
        licenseKey: 'non-commercial-and-evaluation'
      },
        };
    },
    components:{
        HotTable,
        HotColumn
    }
}
</script>

<style>

</style>