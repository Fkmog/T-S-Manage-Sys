<template>
   <div class="pageNav">
    <ul>
    <li><router-link  :to="`${this.msg.path}`">{{this.msg.value}}</router-link></li>
    </ul>
    </div>
</template>

<script>
export default {
    name:'HeaderNav',   
    props:["msg"],
}
</script>

<style>
/* 设置所有字体为微软雅黑 */
*{
    font-family: Microsoft Yahei;;
}
/* 取消列表的点 */
ul{
    list-style-type:none;
}
.pageNav a{
    display: block;
    position: relative;
    padding-left: 2px;
    padding-right: 2px;
    color: #fff;
    font-size: 16px;
    line-height: 30px;
    font-size: 18px;
    text-decoration: none;
}
.pageNav>ul{
    display: flex;
    padding-inline-start:0px ;
    margin-right: 30px;
}
.pageNav a::after{
    content: "";
    height: 2px;
    overflow: hidden;
    display: block;
    left:0;
    bottom:0;
    position: absolute;
    width:100%;
    background: white;
    transform: scaleX(0);
    transition:all 0.25s;
}
.pageNav a:hover::after{
    transform: scaleX(1);
}

</style>