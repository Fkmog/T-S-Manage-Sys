<template>
  培养目标
  <div class="two-digits">
    <section class="num-title">
      <section class="num-wrap">
        <span class="title-text">1</span>
      </section>
      <section class="rotate-bar"></section>
    </section>
  </div>
</template>

<script>
export default {
  name: "Goal",
};
</script>

<style scoped>
/* 数字标题 */
.num-title {
  max-width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: table;
  width: 40px;
  color: #5c6bc0;
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
  margin: auto;
}
.num-wrap {
  max-width: 100%;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  color: rgb(255, 255, 255);
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.title-text {
  max-width: 100%;
  font-size: 50px;
  font-weight: bold;
  color: #5c6bc0;
  box-sizing: border-box !important;
  word-wrap: break-word !important;
}
.rotate-bar {
  margin-top: 5px;
  margin-left: -4px;
  max-width: 100%;
  box-sizing: border-box;
  width: 18px;
  height: 70px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgb(198, 198, 199);
  transform: rotate(35deg);
  word-wrap: break-word !important;
  background-color: rgb(254, 254, 254);
}
</style>