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
      <div v-show="identity.roleName == '课程负责人'">
        <el-col :span="18">
          <el-tag effect="plain">
            {{ identity.roleName }}
          </el-tag>
        </el-col>
        <el-col :span="6">
          <el-tag effect="plain">
            {{ identity.roleName }}
          </el-tag>
        </el-col>
      </div>
    </div>
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
        />
      </el-form-item>
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
import { ElMessage, ElMessageBox } from "element-plus";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue";
import { updateUserPwd } from "@/api/userInfo/getUserInfo";
export default {
  name: "HeaderIdentity",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      showDown: true,
      showCard: false,
      dialogFormVisible: false,
      formLabelWidth: "80px",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
    };
  },
  components: {
    CaretBottom,
    CaretTop,
  },
  mounted() {},
  methods: {
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
          ElMessage({
            type: "success",
            message: "已退出登录！",
            duration: 1500,
          });
          Cookies.remove("Admin-Token");
          Cookies.remove("first-Login");
          this.$router.push("/login");
        })
        .catch(() => {});
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
              if(res.code==="ERROR"){
                if(res.msg=='新密码不能与旧密码相同')
                ElMessage({
                  type: "error",
                  message: res.msg,
                  duration: 1500,
                });
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
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
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
      if (identity.roleName == "学院管理员") {
        this.$router.replace("/major");
      }
      if (identity.roleName == "教师") {
        this.$router.replace("teacherClasses");
      }
      if (identity.roleName == "课程负责人") {
        this.$router.replace("BaseCourse");
      }
    },
  },
};
</script>

<style scoped>
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
