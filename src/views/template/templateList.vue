<template>
  <div class="content">
    <addBtn @click="addTemplate()"></addBtn>
    <el-table
      class="ListTable"
      :data="workbookList"
      style="width: 800px"
      :header-cell-style="{
        'padding-left': '20px',
        'font-size': '14.4px',
        height: '48px',
        'font-weight': 'bold',
        color: 'black',
      }"
      :cell-style="{
        'padding-left': '20px',
        'font-size': '16px',
        height: '60px',
        cursor: 'pointer',
      }"
      highlight-current-row
      @row-click="goEdit"
    >
      <el-table-column prop="name" label="模板名称" width="300" />
      <el-table-column prop="updateTime" label="更新时间" width="300" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-row>
            <el-col :span="6">
              <el-tooltip content="修改" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="editBook(scope.row)"
                  ><el-icon><Edit /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
              <el-tooltip content="删除" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="deleteBook(scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Back, Delete, Edit } from "@element-plus/icons-vue";
import addBtn from "@/components/general/addBtn.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  checkWorkbook,
  newWorkbookInfo,
  deleteWorkbook,
  editWorkbookInfo,
} from "@/api/workbook";

export default {
  name: "TemplateList",
  components: {
    Back,
    addBtn,
    Delete,
    Edit,
  },
  data() {
    return {
      departmentId: "",
      workbookList: [],
    };
  },
  mounted() {
    this.departmentId = this.$store.state.currentInfo.departmentId;
    this.getWorkbookList();
  },
  methods: {
    backSetting() {
      this.$router.push("/departmentSetting");
    },
    //跳转编辑
    goEdit(row) {
      console.log(row);
      this.$router.push({
        path: "/templateEdit",
        query: { workbookId: row.workbookId },
      });
    },
    //新建模板
    addTemplate() {
      ElMessageBox.prompt("模板名称：", "新建模板", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: "add-major-box",
        //校验规则
        inputPattern: /^.+$/,
        inputErrorMessage: "请输入新增模板名称",
      })
        .then(({ value }) => {
          newWorkbookInfo(value, this.departmentId).then((res) => {
            if (res.code === "SUCCESS") {
              this.getWorkbookList();
              ElMessage({
                type: "success",
                message: `新建成功`,
                duration: 1500,
              });
            }
          });
        })
        .catch(() => {});
    },
    //查询工作手册列表
    getWorkbookList() {
      checkWorkbook(this.departmentId).then((res) => {
        console.log("workbookList", res);
        if (res.code === "SUCCESS") {
          this.workbookList = res.rows;
          this.workbookList.forEach((book) => {
            if (book.updateTime === null) {
              book.updateTime = book.createTime;
            }
          });
        }
      });
    },
    // 修改工作手册名称
    editBook(row) {
      console.log(row);
      ElMessageBox.prompt("新的工作手册名称：", "修改工作手册名称", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValue: row.name,
        //校验规则
        inputPattern: /^.+$/,
        inputErrorMessage: "请输入修改后的工作手册名称",
      })
        .then(({ value }) => {
          row.name = value;
          editWorkbookInfo(row).then((res) => {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1500,
            });
            this.getWorkbookList();
          });
        })
        .catch(() => {});
    },
    // 删除工作手册
    deleteBook(row) {
      console.log(row);
      ElMessageBox.confirm("是否确认删除模板?", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteWorkbook(row.workbookId).then((res) => {
          if (res === 204) {
            this.getWorkbookList();
            ElMessage({
              type: "success",
              message: `删除成功`,
              duration: 1500,
            });
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
/* 顶部导航栏 */
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
.block_title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.ListTable {
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
:deep().el-icon {
  font-size: large;
}
</style>
