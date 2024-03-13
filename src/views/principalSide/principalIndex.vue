<template>
    <MainHeader></MainHeader>
    <router-view />
</template>

<script>
import MainHeader from '@/components/index/header/header.vue'

export default {
  name: 'PrincipalIndex',
  components: {
    MainHeader,
  },
  
}
</script>

<style>

</style>