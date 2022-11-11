<template>
  <div>
    <span class="info" @click="show">
      {{$store.state.userInfo.userName}}  | {{$store.state.userInfo.roleInfo[0].roleName}}
      <el-icon v-show="showDown" class="infoIconDown" size="14px">
        <CaretBottom />
      </el-icon>
      <el-icon v-show="!showDown" class="infoIconUp" size="14px">
        <CaretTop />
      </el-icon>
    </span>
  </div>

  <!-- 卡片 -->
  <el-card class="box-card" v-show="showCard">
    <template #header>
      <div class="card-header">
        <span class="cardInfo">身份信息</span>
        <div class="cardBtn">
          <span class="cardOption1">修改密码</span>
          <span class="cardOption2" @click="exit">退出</span>
        </div>
      </div>
    </template>
    <div class="identity">角色A1</div>
    <div class="identity">角色B</div>
  </el-card>
</template>

<script>
import Cookies from "js-cookie";
import { ElMessage, ElMessageBox } from "element-plus";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue";
export default {
  name: "HeaderIdentity",
  data() {
    return {
      showDown: true,
      showCard: false,
    };
  },
  components: {
    CaretBottom,
    CaretTop,
  },
  mounted() {
   
  },
  methods: {
    // 控制角色信息卡片
    show() {
      this.showCard = !this.showCard;
      this.showDown = !this.showDown;
    },
    //用户退出
    exit() {
      ElMessageBox.confirm("是否确定退出登录？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "已退出登录！",
          });
          Cookies.remove("Admin-Token");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.info {
  font-family: Microsoft Yahei;
  color: white;
  font-size: 14px;
  position: absolute;
  right: 50px;
  top: 50px;
  cursor: pointer;
}
.box-card {
  position: absolute;
  right: 50px;
  top: 80px;
  width: 350px;
  animation: animate 0.5s ease;
  z-index:100;
}
@keyframes animate {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.infoIconDown {
  color: white;
  left: 3px;
  top: 5px;
  position: relative;
}
.infoIconUp {
  color: white;
  left: 3px;
  top: 5px;
  position: relative;
}
.card-header {
  display: flex;
  flex-direction: row;
  height: 20px;
}
.cardBtn {
  display: flex;
  flex-direction: column;
  margin-left: 180px;
}
.cardOption1 {
  font-size: 14px;
  cursor: pointer;
  margin-top: -5px;
}
.cardOption1:hover {
  color: #5c6bc0;
}
.cardOption2 {
  font-size: 14px;
  cursor: pointer;
  color: grey;
  margin-top: 2px;
}
.cardOption2:hover {
  color: #5c6bc0;
}
.identity {
  cursor: pointer;
  margin-top: 5px;
}
.identity:hover {
  cursor: pointer;
  color: #5c6bc0;
}
</style>