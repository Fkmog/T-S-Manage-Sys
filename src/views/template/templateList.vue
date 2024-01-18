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
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="updateTime" label="更新时间" width="250" />
      <el-table-column prop="report" label="模板文件" width="200">
        <template #default="scope">
          <el-row v-show="scope.row.templateFile === null">
            <el-col>
              <el-tooltip content="添加模板" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="check(scope.row)"
                  ><el-icon><DocumentAdd /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row v-show="scope.row.templateFile !== null">
            <el-col>
              <el-tooltip content="查看模板" :hide-after="0">
                <el-button
                  link
                  style="color: #3f51b5"
                  @click.stop="check(scope.row)"
                  ><el-icon><Document /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-row>
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
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 唤起的dialog -->
    <el-dialog v-model="dialogVisible" width="400px" :show-close="false">
      <el-row style="margin-left: 30px">
        <el-col v-show="hasFile">
          <el-table
            :data="filesList"
            style="cursor: pointer; margin-top: 10px; width: 280px"
            :show-header="false"
            @row-click="downloadFile"
          >
            <el-table-column prop="originalName" label="文件名" width="280px" />
            <!-- <el-table-column width="80px"> -->
            <!-- <template #default="scope">
                <el-tooltip content="移除" :hide-after="0">
                  <el-button
                    link
                    style="color: #3f51b5"
                    @click.stop="beforeRemove(scope.row)"
                    ><el-icon><CircleClose /></el-icon
                  ></el-button>
                </el-tooltip>
              </template> -->
            <!-- </el-table-column> -->
          </el-table>
        </el-col>
        <el-row style="margin-top: 30px">
          <el-upload
            :show-file-list="false"
            class="upload-demo"
            :action="action"
            :headers="headers"
            accept=".doc,.docx"
            name="files"
            :data="data"
            :limit="1"
            :on-success="uploadSuccess"
            :on-exceed="uploadExceed"
          >
            <el-button type="primary">上传模板</el-button>
          </el-upload>
        </el-row>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Back,
  Delete,
  Edit,
  Document,
  DocumentAdd,
  CircleClose,
} from "@element-plus/icons-vue";
import Cookies from "js-cookie";
import addBtn from "@/components/general/addBtn.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  checkWorkbook,
  newWorkbookInfo,
  deleteWorkbook,
  editWorkbookInfo,
} from "@/api/workbook";
import { downloadFileId, downloadFile, removeFileId } from "@/api/common";

export default {
  name: "TemplateList",
  components: {
    Back,
    addBtn,
    Delete,
    Edit,
    Document,
    DocumentAdd,
    CircleClose,
  },
  data() {
    return {
      departmentId: "",
      workbookList: [],
      dialogVisible: false,
      hasFile: false,
      fileName: "",
      filesList: [],
      rowInfo: {},
      //上传文件
      headers: {
        Authorization: "Bearer " + Cookies.get("Admin-Token"),
      },
      action: "http://47.113.206.164:8080/common/upload/files",
      data: {
        type: "reportTemplateFile",
        param: "",
      },
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
    //查看报告模板情况
    check(row) {
      console.log("check", row);
      this.data.param = row.workbookId;
      this.rowInfo = row;
      if (row.templateFile === null) {
        this.hasFile = false;
      } else {
        this.hasFile = true;
        this.filesList = [];
        this.filesList.push(row.templateFile);
        this.fileName = row.templateFile.originalName;
      }
      this.dialogVisible = true;
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      console.log("response", response, file, "file", fileList, "fileList");
      if (response.code == "SUCCESS") {
        ElMessage({
          type: "success",
          message: `上传成功`,
          duration: 1500,
        });
        this.dialogVisible = false;
        this.getWorkbookList();
      }
    },
    //下载文件
    downloadFile(row) {
      downloadFile(row.fileAddress).then((res) => {
        // console.log("downloadFile", res);
        const blob = new Blob([res]);
        // console.log("blob", blob);
        // saveAs(blob, this.objectInfo.fileName)
        const link = document.createElement("a");
        link.download = decodeURI(row.originalName);
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
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
