<template>
  <div>
    <span class="info" @click="show">
      {{ $store.state.userInfo.userName }} |
      {{ $store.state.currentInfo.identity }}
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
        <span class="cardInfo" style="cursor: default">身份信息</span>
        <div class="cardBtn">
          <span class="cardOption1" @click="dialogFormVisible = true"
            >修改密码</span
          >
          <span class="cardOption2" @click="exit">退出</span>
        </div>
      </div>
    </template>
    <div
      class="identity"
      v-for="(identity, index) in $store.state.userInfo.identity"
      :key="index"
      @click="changeCurrentInfo(identity, index)"
    >
      <el-row v-show="identity.roleName !== '课程负责人'">
        <el-col :span="18">
          {{ identity.departmentName }}
        </el-col>
        <el-col :span="6">
          <el-tag effect="plain">
            {{ identity.roleName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row v-show="identity.roleName == '课程负责人'">
        <el-col :span="18">
          {{ identity.departmentName }}
        </el-col>
        <el-col :span="6">
          <el-tag effect="plain">
            {{ identity.roleName }}
          </el-tag>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top: 20px">
      <img src="@/assets/PDF.png" alt="Icon" class="pdfIcon" />
      <div class="download" @click="downloadFile()">用户使用手册v1.0.2</div>
    </el-row>
  </el-card>
  <!-- 修改密码 -->
  <el-dialog title="修改密码" v-model="dialogFormVisible" width="400px">
    <el-form ref="form" :model="user" :rules="rules">
      <el-form-item
        label="旧密码"
        prop="oldPassword"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="user.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPassword"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="user.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
          @change="checkPassword"
        />
      </el-form-item>
      <el-progress
        class="progress"
        v-show="passwordStrength"
        :percentage="passwordStrength"
        :format="format"
        :color="customColorMethod"
      />
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="user.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="changePwd">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Cookies from "js-cookie";
import { logout } from "@/api/login/login.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue";
import { updateUserPwd } from "@/api/userInfo/getUserInfo";
import { downloadFileId } from "@/api/common";

export default {
  name: "HeaderIdentity",
  data() {
    const passwordStr = (rule, value, callback) => {
      const lowercaseRegex = /[a-z]/; // 小写字母正则表达式
      const uppercaseRegex = /[A-Z]/; // 大写字母正则表达式
      const digitRegex = /[0-9]/; // 数字正则表达式
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // 特殊字符正则表达式
      let hasLowercase = lowercaseRegex.test(value);
      let hasUppercase = uppercaseRegex.test(value);
      let hasDigit = digitRegex.test(value);
      let hasSpecialChar = specialCharRegex.test(value);
      let strength =
        (hasLowercase ? 1 : 0) +
        (hasUppercase ? 1 : 0) +
        (hasDigit ? 1 : 0) +
        (hasSpecialChar ? 1 : 0);

      if (value.length < 8 || value.length20) {
        callback(new Error("密码长度应为8至20位"));
      } else if (strength < 3) {
        callback(new Error("应包含数字,大写字母,小写字母,特殊字符中的三项"));
      } else {
        callback();
      }
    };
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      teacherId: false,
      showDown: true,
      showCard: false,
      dialogFormVisible: false,
      formLabelWidth: "80px",
      user: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { required: true, validator: passwordStr, trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
      passwordStrength: "",
    };
  },
  components: {
    CaretBottom,
    CaretTop,
  },
  mounted() {},
  methods: {
    downloadFile() {
      console.log("download", this.$store.state.userInfo.identity);
      for (let item of this.$store.state.userInfo.identity) {
        if (item.roleName == "教师") {
          this.teacherId = true;
        }
      }
      let id = "";
      if (this.teacherId == true) {
        id = 164;
      } else {
        id = 163;
      }
      downloadFileId(id).then((res) => {
        console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob",blob);
        const link = document.createElement("a");
        link.download = decodeURI("教学过程质量监控管理平台用户使用手册.pdf");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    // 控制角色信息卡片
    show() {
      this.showCard = !this.showCard;
      this.showDown = !this.showDown;
    },
    //用户退出
    exit() {
      ElMessageBox.confirm("是否确认退出登录？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          logout().then((res) => {
            if (res.code === "SUCCESS") {
              ElMessage({
                type: "success",
                message: "已退出登录",
                duration: 1500,
              });
              Cookies.remove("Admin-Token");
              Cookies.remove("first-Login");
              this.$router.push("/login");
            } else {
              ElMessage({
                type: "error",
                message: "退出登录失败",
                duration: 1500,
              });
            }
          });
        })
        .catch(() => {});
    },
    // 检查密码强度
    checkPassword() {
      const lowercaseRegex = /[a-z]/; // 小写字母正则表达式
      const uppercaseRegex = /[A-Z]/; // 大写字母正则表达式
      const digitRegex = /[0-9]/; // 数字正则表达式
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // 特殊字符正则表达式
      const hasLowercase = lowercaseRegex.test(this.user.newPassword);
      const hasUppercase = uppercaseRegex.test(this.user.newPassword);
      const hasDigit = digitRegex.test(this.user.newPassword);
      const hasSpecialChar = specialCharRegex.test(this.user.newPassword);
      const strength =
        (hasLowercase ? 1 : 0) +
        (hasUppercase ? 1 : 0) +
        (hasDigit ? 1 : 0) +
        (hasSpecialChar ? 1 : 0);

      if (this.user.newPassword.length < 8) {
        this.passwordStrength = "";
      } else if (strength >= 3) {
        this.passwordStrength = 100;
      } else if (strength === 2) {
        this.passwordStrength = 60;
      } else if (strength === 1) {
        this.passwordStrength = 30;
      } else {
        this.passwordStrength = "";
      }
    },
    format(percentage) {
      if (percentage === 100) {
        return "强";
      } else if (percentage === 60) {
        return "中";
      } else if (percentage === 30) {
        return "弱";
      } else {
        return "";
      }
    },
    customColorMethod(percentage) {
      if (percentage === 30) {
        return "#f41e1e";
      } else if (percentage === 60) {
        return "#e6a23c";
      } else if (percentage === 100) {
        return "#67c23a";
      } else {
        return "#67c23a";
      }
    },
    // 修改密码
    changePwd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
            (res) => {
              if (res.code === "SUCCESS") {
                this.dialogFormVisible = false;
                ElMessage({
                  type: "success",
                  message: `更新成功`,
                  duration: 1500,
                });
              }
              if (res.code === "ERROR") {
                if (res.msg == "新密码不能与旧密码相同") {
                  ElMessage({
                    type: "error",
                    message: res.msg,
                    duration: 1500,
                  });
                } else if (res.msg == "修改密码失败，旧密码错误") {
                  ElMessage({
                    type: "error",
                    message: res.msg,
                    duration: 1500,
                  });
                }
              }
            }
          );
        }
      });
    },
    // 取消修改
    cancel() {
      this.dialogFormVisible = false;
      this.user = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    //修改当前专业/学院等信息
    changeCurrentInfo(identity, index) {
      console.log("identity", identity);
      this.$store.commit(
        "currentInfo/setDepartmentName",
        identity.departmentName
      );
      this.$store.commit("currentInfo/setDepartmentId", identity.departmentId);
      this.$store.commit("currentInfo/setSchoolName", identity.schoolName);
      this.$store.commit("currentInfo/setSchoolId", identity.schoolId);
      this.$store.commit(
        "currentInfo/setRole",
        this.$store.state.userInfo.identity[index]
      );
      this.$store.getters["currentInfo/changeIsTeacher"];
      if (identity.roleName === "学院管理员") {
        this.$router.replace("/major");
      }
      if (identity.roleName === "教师") {
        this.$router.replace("teacherClasses");
      }
      if (identity.roleName === "课程负责人") {
        this.$router.replace("BaseCourse");
      }
    },
  },
};
</script>

<style scoped>
.pdfIcon {
  width: 20px;
  height: 20px;
}
.download {
  cursor: pointer;
  font-size: 16px;
  text-decoration-line: underline;
  margin-left: 5px;
}
.download:hover {
  color: #5c6bc0;
}
.progress {
  margin-left: 80px;
  margin-bottom: 10px;
  width: 310px;
}
.info {
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
  z-index: 1000;
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
  left: 2px;
  top: 2px;
  position: relative;
}
.infoIconUp {
  color: white;
  left: 2px;
  top: 2px;
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
