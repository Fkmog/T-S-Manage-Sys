<template>
  <div class="bg">
    <div class="background"></div>
    <div class="loginContainer">
      <div class="card">
        <div class="loginCard">
          <h2 style=" margin-top:-40px; text-align: center;">教学过程质量监控管理平台</h2>
          <el-form
            :rules="rules"
            ref="loginForm"
            :model="loginForm"
            style="margin-top: 40px"
          >
            <el-form-item prop="userName">
              <el-input
                placeholder="请输入用户名"
                v-model="loginForm.userName"
                clearable
                size="large"
              >
                <template #prefix>
                  <el-icon><user /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="passWord" :error="errorMsg">
              <el-input
                v-model="loginForm.passWord"
                placeholder="请输入密码"
                type="password"
                show-password
                clearable
                size="large"
                style="margin-top: 10px"
                @keyup.enter="userLogin()"
              >
                <template #prefix>
                  <el-icon><lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button
              size="large"
              type="primary"
              style="
                width: 100%;
                margin-top: 10px;
                font-size: 16px;
                box-shadow: 0 0 5px #cac6c6;
              "
              @click="userLogin()"
              >登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button
            >
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { login } from "@/api/login/login";
import { getUserInfo } from "@/api/userInfo/getUserInfo";
import { User, Lock } from "@element-plus/icons-vue";
import { getToken } from "@/utils/request/auth";

export default {
  name: "userLogin",
  components: {
    User,
    Lock,
  },
  data() {
    return {
      loginForm: {
        userName: "",
        passWord: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      errorMsg: "",
    };
  },
  methods: {
    userLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.errorMsg = "";
          login(this.loginForm.userName, this.loginForm.passWord).then(
            (res) => {
              if (res.code == "SUCCESS") {
                //存储token -> cookie
                if (getToken() === undefined) {
                  Cookies.set("Admin-Token", res.token);
                  Cookies.set("first-Login", true);
                } else {
                  Cookies.set("Admin-Token", res.token);
                  Cookies.set("first-Login", false);
                }

                //登陆时保证Nav高亮正确
                this.$store.commit("navInfo/setActiveDisplay1", 0);
                this.$store.commit("navInfo/setActiveDisplay2", 0);
                this.$store.commit("navInfo/setActiveDisplay3", 0);
                this.$store.commit("navInfo/setActiveDisplay4", 0);
                //存用户信息 ->vuex
                getUserInfo().then((res) => {
                  console.log("userInfo", res);
                  this.$store.commit("userInfo/setUserName", res.user.userName);
                  this.$store.commit("userInfo/setUserId", res.user.userId);
                  this.$store.commit("userInfo/setRoleInfo", res.user.roles);
                  this.$store.commit("userInfo/setIdentity", res.roles);
                  //设置默认当前学院，学校等信息
                  if (res.roles.length !== 0) {
                    this.$store.commit(
                      "currentInfo/setDepartmentName",
                      res.roles[0].departmentName
                    );
                    this.$store.commit(
                      "currentInfo/setDepartmentId",
                      res.roles[0].departmentId
                    );
                    this.$store.commit(
                      "currentInfo/setSchoolName",
                      res.roles[0].schoolName
                    );
                    this.$store.commit(
                      "currentInfo/setSchoolId",
                      res.roles[0].schoolId
                    );
                    this.$store.commit("currentInfo/setRole", res.roles[0]);
                  }
                  this.$store.getters["currentInfo/changeIsTeacher"];
                  if (this.$store.state.currentInfo.identity == "学院管理员") {
                    this.$router.replace("major");
                  }
                  if (this.$store.state.currentInfo.identity == "教师") {
                    this.$router.replace("teacherClasses");
                  }
                  if (this.$store.state.currentInfo.identity == "课程负责人") {
                    this.$router.replace("BaseCourse");
                  }
                  if (this.$store.state.currentInfo.identity == "web管理员") {
                    this.$router.replace("Schools");
                  }
                });
              }

              if (res.code === "ERROR") {
                this.errorMsg = "账号/密码不正确，请重新输入";
                this.loginForm.passWord = "";
                return;
              }
            }
          );
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.bg {
  position: relative;
  display: flex;
  height: 100vh;
  /* top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 100%;
  width: 100%; */
  /* z-index: 100; */
  /* background-color: #f2f2f2; */
  background-color: #f6f6f7;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-image: url("@/assets/bg.png");
  background-size: cover;
  /* filter: blur(10px); 背景模糊效果 */
}
.loginContainer {
  display: flex;
  flex: 0 0 50%;
  margin-left: auto;
}
.card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}
.loginCard {
  /* border-radius: 15px;
  background-clip: padding-box; */
  margin: 240px auto;
  padding: 15px 35px;
  /* background-color: red;
  background: rgb(255, 255, 255);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6; */
  width: 320px;
  height: 220px;
  margin-left: auto;
}
</style>
