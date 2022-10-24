<template>
  <a  @click=toMajor>专业1</a><br>
  <a  @click=toMajor>专业2</a>

</template>

<script>
export default {
  name: "Major",
  data() {
    return {
      userName: "",
      passWord: "",
    };
  },
  methods: {
   toMajor(){
     console.log('123') ;
     
   }
  },
};
</script>

<style>
/**

.card{
  margin-left: 200px;
  width:450px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
}
 .card:hover {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
}

.card__body {
  position: relative;
  height: 185px;
  padding: 20px;
  transition: height 0.5s;
}
.card:hover .card__body {
  height: 300px;
}
/**
* DESCRIPTION
**/
/**
.card__description {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 50px;
  margin: 0;
  padding: 0;
  color: #666C74;
  line-height: 27px;
  opacity: 0;  
  transform: translateY(20px);
  transition: opacity 0.3s, -webkit-transform 0.3s;
  transition-delay: 0s;
}
.card:hover .card__description {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.card__thumb {
  height: 200px;
  overflow: hidden;
  background-color: #000;
  -webkit-transition: height 0.5s;
  transition: height 0.5s;
}
.card__thumb img {

  height: 250px;
  display: block;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.5s, transform 0.5s;
}
.card:hover .card__thumb {
  height: 130px;
}

.card:hover .card__thumb img {
  opacity: 0.6;
  背景img大小变化 
  -webkit-transform: scale(1);
          transform: scale(1);
}
 **/
</style>