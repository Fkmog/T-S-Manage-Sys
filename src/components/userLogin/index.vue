<template>
  <div class="bg">
    <div class="loginContainer">
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
</template>

<script>
import Cookies from "js-cookie";
import { login } from "@/api/login/login";
import { getUserInfo } from "@/api/userInfo/getUserInfo";
import { User, Lock } from "@element-plus/icons-vue";
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
                Cookies.set("Admin-Token", res.token);
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
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: #f2f2f2;
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 240px auto;
  padding: 15px 35px;
  background-color: red;
  background: rgb(255, 255, 255);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  width: 320px;
  height: 220px;
}
</style>
