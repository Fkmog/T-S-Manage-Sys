<template>
  <div class="content">
    <!-- 顶部导航栏 -->
    <div class="block">
      <el-row class="block-row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="返回"
          placement="bottom"
          :hide-after="0"
        >
          <el-icon
            class="icon"
            size="24px"
            color="rgb(137, 137, 137)"
            style="margin-left: 50px"
            @click="back()"
          >
            <Back />
          </el-icon>
        </el-tooltip>
        <div class="head_title">工作手册</div>
        <el-divider class="divider" direction="vertical" />
        <div v-show="hasWorkbook">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="修改关联模板"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 10px"
              @click="changeWorkbook = true"
            >
              <Switch />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="删除关联模板"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left:20px"
              @click="Delete"
            >
              <Delete />
            </el-icon>
          </el-tooltip>
        </div>
        <div v-show="!hasWorkbook">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="分配手册模板"
            placement="bottom"
            :hide-after="0"
          >
            <el-icon
              class="icon"
              size="24px"
              color="rgb(137, 137, 137)"
              style="margin-left: 10px"
              @click="addWorkbook = true"
            >
              <Switch />
            </el-icon>
          </el-tooltip>
        </div>
      </el-row>
    </div>
    <div class="body" v-show="hasWorkbook">
      <div class="card">
        <el-row class="all_block">
          <el-col class="body_block">
            <el-col class="title">工作手册名称</el-col>
            <el-col class="detail">{{ workbookInfo.name }}</el-col>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="no-workbook" v-show="!hasWorkbook">
      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 100px;
          font-size: 22px;
        "
      >
        暂未分配工作手册模板
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          color: grey;
          font-size: 13px;
          margin-top: 30px;
        "
      >
        请先分配工作手册模板
      </div>
    </div>
    <!-- 修改关联模板 -->
    <el-dialog
      v-model="changeWorkbook"
      title="修改关联模板"
      width="330px"
      :show-close="false"
      :align-center="true"
    >
      <el-select
        v-model="workbookId"
        style="width: 250px; margin-left: 20px"
        :placeholder="`${workbookInfo.name}`"
      >
        <el-option
          v-for="workbook in workbooks"
          :key="workbook.workbookId"
          :label="workbook.name"
          :value="workbook.workbookId"
        >
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changeWorkbook = false">取消</el-button>
          <el-button type="primary" @click="submit()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增关联模板 -->
    <el-dialog
      v-model="addWorkbook"
      title="分配手册模板"
      width="330px"
      :show-close="false"
      :align-center="true"
    >
      <el-select
        v-model="workbookId"
        style="width: 250px; margin-left: 20px"
        :placeholder="选择手册模板"
      >
        <el-option
          v-for="workbook in workbooks"
          :key="workbook.workbookId"
          :label="workbook.name"
          :value="workbook.workbookId"
        >
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addWorkbook = false">取消</el-button>
          <el-button type="primary" @click="submit()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { Back, Switch, Delete } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { WorkbookByCourseId, checkWorkbook, setWorkbook } from "@/api/workbook";
export default {
  name: "templateManage",
  components: {
    Back,
    Switch,
    Delete,
  },
  data() {
    return {
      departmentId: "",
      courseId: "",
      hasWorkbook: Boolean,
      workbookInfo: [],
      changeWorkbook: false,
      addWorkbook: false,
      workbookId: "",
      workbooks: [],
    };
  },
  mounted() {
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.courseId = this.$store.state.course.courseId;
    this.getWorkbookInfo();
    this.getWorkbooks();
  },
  methods: {
    back() {
      this.$router.push("/baseCourseDetail");
    },
    // 查询所有的工作手册
    getWorkbooks() {
      checkWorkbook(this.departmentId).then((res) => {
        if (res.code == "SUCCESS") {
          this.workbooks = res.rows;
          console.log("workbooks", this.workbooks);
        }
      });
    },
    // 通过courseId查询workbook
    getWorkbookInfo() {
      WorkbookByCourseId(this.courseId)
        .then((res) => {
          if ((res.code = "SUCCESS")) {
            this.hasWorkbook = true;
            this.workbookInfo = res.data;
            console.log("workbookInfo", this.workbookInfo);
          }
        })
        .catch((e) => {
          console.log("e", e);
          if (e.code == "NOT_FIND") {
            this.hasWorkbook = false;
          }
        });
    },
    //提交修改
    submit() {
      if (this.changeWorkbook == true) {
        ElMessageBox.confirm("是否确认修改关联的工作手册模板？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.associate();
        });
      } else {
        this.associate();
      }
    },
    // 分配课程库模板
    associate() {
      let obj = {};
      obj.workbookId = this.workbookId;
      obj.courseId = this.courseId;
      let array = [];
      array.push(obj);
      setWorkbook(array).then((res) => {
        if (res.code == "SUCCESS" && this.changeWorkbook == true) {
          ElMessage({
            type: "success",
            message: `更新成功`,
            duration: 1500,
          });
          this.changeWorkbook = false;
          this.getWorkbookInfo();
        }
        if (res.code == "SUCCESS" && this.addWorkbook == true) {
          ElMessage({
            type: "success",
            message: `分配成功`,
            duration: 1500,
          });
          this.addWorkbook = false;
          this.getWorkbookInfo();
        }
      });
    },
    // 删除关联模板
    Delete() {
      ElMessageBox.confirm("是否确认删除关联的工作手册模板？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let obj = {};
        obj.workbookId = 0;
        obj.courseId = this.courseId;
        let array = [];
        array.push(obj);
        setWorkbook(array).then((res) => {
          console.log("res", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `删除成功`,
              duration: 1500,
            });
            this.getWorkbookInfo();
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 18px;
}
.head_title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.body {
  display: flex;
  justify-content: center;
}
.card {
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 50px 20px;
  margin-top: 100px;
}
.all_block {
  margin-left: 30px;
}
.body_block {
  margin-top: 40px;
}
.title {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
  color: #757575;
  height: 50px;
}
.detail {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2em;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
</style>
