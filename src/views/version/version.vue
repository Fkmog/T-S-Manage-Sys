<template>
  <div class="content">
    <addBtn
      @click="
        this.addFlag = true;
        this.deleteFlag = false;
        this.editFlag = false;
        this.showEditVersionDailogFlag = true;
      "
    ></addBtn>

    <el-table
      :data="versions"
      class="el-table-container"
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
      }"
      style="width: 800px"
    >
      <el-table-column label="名称" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="面向年级" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.enrollYear }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="修订年份" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.reviseYear }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-row >
        <el-col :span="6">
          <el-tooltip content="删除">
            <el-button 
            class="deleteButton"
            link
            style="color: #3f51b5"
            @click.stop="this.deleteVersion(scope.row);">
              <el-icon>
                  <Delete />
            </el-icon>
            </el-button>
            
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-tooltip content="修改版本信息">
           <el-button 
            class="deleteButton"
            link
            style="color: #3f51b5"
           @click="this.editFlag = true;
                    this.deleteFlag = false;
                    this.addFlag = false;
                    this.nameFlag = true;
                    this.selectVersion(scope.row);
                    this.showEditVersionDailogFlag = true;">
            <el-icon><Edit /></el-icon>
           </el-button>
              
          </el-tooltip>
        </el-col>
      </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="showEditVersionDailogFlag" width="500">
    <template #header>
      <h4 v-show="addFlag">课程大纲版本号新建</h4>
      <h4 v-show="editFlag">版本信息</h4>
      <h4 v-show="deleteFlag">课程大纲版本号删除</h4>
    </template>
    <el-form :model="versionForm" :rules="editVersionRules">
      <el-form-item
        v-show="addFlag"
        label="课程大纲版本号"
        :label-width="formLabelWidth"
        prop="name"
        :error="C_ErrorMsg_editVersion_name"
      >
        <el-input v-model="versionForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        v-show="editFlag || deleteFlag"
        label="课程大纲版本号"
        :label-width="formLabelWidth"
        :error="C_ErrorMsg_editVersion_name"
        prop="name"
      >
        <el-input v-model="versionForm.name"  autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="面向年级"
        :label-width="formLabelWidth"
        prop="enrollYear"
        :error="C_ErrorMsg_editVersion_enrollYear"
      >
        <el-input v-model="versionForm.enrollYear" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="修订年份"
        :label-width="formLabelWidth"
        prop="reviseYear"
        :error="C_ErrorMsg_editVersion_reviseYear"
      >
        <el-input v-model="versionForm.reviseYear" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            showEditVersionDailogFlag = false;
            this.cancelVersionForm();
          "
          >取消</el-button
        >
        <el-button
          v-show="addFlag"
          type="primary"
          :disabled="!submitFlag"
          @click="addVersion()"
        >
          确认
        </el-button>
        <el-button
          v-show="editFlag"
          type="primary"
          
          @click="editVersion()"
        >
          确认
        </el-button>
        <el-button
          v-show="deleteFlag"
          type="primary"
          :disabled="!submitFlag"
          @click="deleteVersion()"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import request from "@/utils/request/request";
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref, reactive, version } from "vue";
import {
  ElTooltip,
  ElIcon,
  ElInput,
  ElForm,
  ElButton,
  ElTable,
  ElMessage,
  ElMessageBox,
  ElDialog,
  ElDropdown,
  ElTag,
} from "element-plus";
import {
  Back,
  FolderChecked,
  InfoFilled,
  Loading,
  Search,
  Close,
  Plus,
  Delete,
  Edit,
  MoreFilled,
  ArrowDown,
  Document,
  Avatar,
  DocumentChecked,
  User,
  CircleClose,
  Collection,
  
  
} from "@element-plus/icons-vue";
import { getDictionary } from "@/api/dictionary";
import { setWorkbook, checkWorkbook } from "@/api/workbook";
export default {
  name: "Version",
  components: {
    request,
    ElTooltip,
    ElIcon,
    ElInput,
    ElForm,
    ElButton,
    ElTable,
    ElMessage,
    ElMessageBox,
    Back,
    FolderChecked,
    InfoFilled,
    Loading,
    Search,
    Close,
    Plus,
    Delete,
    ElDialog,
    ref,
    reactive,
    Delete,
    Edit,
    HeaderSearch,
    addBtn,
    MoreFilled,
    ElDropdown,
    ArrowDown,
    Document,
    ElTag,
    Avatar,
    DocumentChecked,
    User,
    CircleClose,
    Collection,
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_name = "请输入版本名称";
      } else {
        let nameformat = /^\d{4}版$/;
        if (!nameformat.test(value)) {
          this.C_ErrorMsg_editVersion_name =
            "请输入正确版本名称格式 例如：2020版";
        } else {
          this.nameFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
      console.log(this.nameFlag, this.enrollYearFlag, this.reviseYearFlag);
    };
    var validateEnrollYear = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_enrollYear = "请输入年份";
      } else {
        let timeformat = /^[1-9]\d{3}$/;
        let numberformat = /^\d+$/;
        if (!numberformat.test(value)) {
          this.C_ErrorMsg_editVersion_enrollYear = "请输入数字";
        } else if (!timeformat.test(value)) {
          this.C_ErrorMsg_editVersion_enrollYear =
            "请输入正确年份格式 例如：2020 ";
        } else {
          this.enrollYearFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
      console.log(this.nameFlag, this.enrollYearFlag, this.reviseYearFlag);
    };
    var validateReviseYear = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_reviseYear = "请输入年份";
      } else {
        let timeformat = /^[1-9]\d{3}$/;
        let numberformat = /^\d+$/;
        if (!numberformat.test(value)) {
          this.C_ErrorMsg_editVersion_reviseYear = "请输入数字";
        } else if (!timeformat.test(value)) {
          this.C_ErrorMsg_editVersion_reviseYear =
            "请输入正确年份格式 例如：2020 ";
        } else {
          this.reviseYearFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
      console.log(this.nameFlag, this.enrollYearFlag, this.reviseYearFlag);
    };
    return {
      formLabelWidth: "140px",

      submitFlag: false,
      nameFlag: false,
      enrollYearFlag: false,
      reviseYearFlag: false,
      addFlag: false,
      editFlag: false,
      deleteFlag: false,
      versions: [],
      versionLabel: [],
      currentVersion: "",
      versionForm: {
        name: "",
        enrollYear: "",
        reviseYear: "",
        versionId: "",
      },
      C_ErrorMsg_editVersion_name: "",
      C_ErrorMsg_editVersion_enrollYear: "",
      C_ErrorMsg_editVersion_reviseYear: "",

      editVersionRules: {
        name: [{ validator: validateName, trigger: "blur" }],
        enrollYear: [{ validator: validateEnrollYear, trigger: "blur" }],
        reviseYear: [
          { validator: validateReviseYear, trigger: "blur" },
          // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
      },

      showEditVersionDailogFlag: false,
    };
  },
  mounted() {
    this.getDictionary();
  },
  methods: {
    goEdit(row){
      this.editFlag = true;
      this.deleteFlag = false;
      this.addFlag = false;
      this.nameFlag = true;
      this.selectVersion(row);
      this.showEditVersionDailogFlag = true;
    },
    addVersion() {
      let that = this;
      return request({
        url: "/detail/version",
        method: "post",
        data: {
          enrollYear: that.versionForm.enrollYear,
          reviseYear: that.versionForm.reviseYear,
          versionName: that.versionForm.name,
        },
      })
        .then((res) => {
          console.log("edit version res:", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            that.showEditVersionDailogFlag = false;
            that.versionForm = {
              name: "",
              enrollYear: "",
              reviseYear: "",
              versionId: "",
            };
            this.getDictionary();
          }
        })
        .catch((e) => {
          console.log("edit version res error:", e);
          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1500,
          });
        });
    },
    editVersion() {
      let that = this;
      return request({
        url: "/detail/version",
        method: "put",
        data: {
          enrollYear: that.versionForm.enrollYear,
          reviseYear: that.versionForm.reviseYear,
          versionName: that.versionForm.name,
          versionId: that.versionForm.versionId,
        },
      })
        .then((res) => {
          console.log("edit version res:", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1500,
            });
            that.showEditVersionDailogFlag = false;
            that.versionForm = {
              name: "",
              enrollYear: "",
              reviseYear: "",
              versionId: "",
            };
            this.getDictionary();
          }
        })
        .catch((e) => {
          console.log("edit version res error:", e);
          ElMessage({
            type: "error",
            message: `更新失败`,
            duration: 1500,
          });
        });
    },
    deleteVersion(row) {
      let that = this;
      console.log('row',row)
      ElMessageBox.confirm("是否确认删除课程大纲版本？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return request({
            url: "/detail/versionRemove/" + row.versionId,
            method: "delete",
          })
            .then((res) => {
              console.log("delete version res:", res);
              if (res === 204) {
                ElMessage({
                  type: "success",
                  message: `删除成功`,
                  duration: 1500,
                });
                if (
                  this.$store.state.course.baseCourseVersionId ==
                  that.versionForm.versionId
                ) {
                  this.$store.commit("course/setbaseCourseVersionId", "");
                }
                that.showEditVersionDailogFlag = false;
                that.versionForm = {
                  name: "",
                  enrollYear: "",
                  reviseYear: "",
                  versionId: "",
                };

                this.getDictionary();
              }
            })
            .catch((e) => {
              console.log("edit version res error:", e);
              ElMessage({
                type: "error",
                message: `删除失败`,
                duration: 1500,
              });
            });
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    cancelVersionForm() {
      this.addFlag = false;
      this.deleteFlag = false;
      this.editFlag = false;
      this.versionForm = {
        name: "",
        enrollYear: "",
        reviseYear: "",
        versionId: "",
      };
      this.C_ErrorMsg_editVersion_name = "";
      this.C_ErrorMsg_editVersion_enrollYear = "";
      this.C_ErrorMsg_editVersion_reviseYear = "";
      this.nameFlag = false;
      this.enrollYearFlag = false;
      this.reviseYearFlag = false;
    },
    selectVersion(row) {
      console.log("row", row);
      for (const element of this.versions) {
        if (element["versionId"] == row.versionId) {
          this.versionForm.name = element["label"];
          this.versionForm.enrollYear = element["enrollYear"];
          this.versionForm.reviseYear = element["reviseYear"];
          this.versionForm.versionId = element["versionId"];
        }
      }
      console.log(
        "name:",
        this.versionForm.name,
        "enrollYear:",
        this.versionForm.enrollYear,
        "reviseYear:",
        this.versionForm.reviseYear
      );
    },
    getDictionary() {
      let that = this;
      this.versions = [];
      this.versionLabel = [];
      return request({
        url: "detail/versionList",
        method: "get",
      })
        .then((res) => {
          console.log("versionList", res);
          if (res.code == "SUCCESS") {
            res.data.forEach((year) => {
              let dict = {
                label: year.versionName,
                enrollYear: year.enrollYear,
                reviseYear: year.reviseYear,
                versionId: year.versionId,
              };
              that.versions.push(dict);
              that.versionLabel.push(year.versionName);
            });
            that.currentVersion =
              that.versionLabel[that.currentVersionValue - 1];
          }
        })
        .catch((e) => {
          console.log("error:", e);
        });
    },
  },
};
</script>

<style scoped>
.deleteButton {
  margin-right: 10px;
  margin-top: 0;
  margin-bottom: 0;
}
:deep().el-icon {
  font-size: large;
}
.colstyle {
  margin-top: 10px;
}
.rowstyle {
  justify-content: center;
}

.content {
  margin-top: 85px;
  margin-left: 5%;
  margin-right: 5%;
}
.el-table-container {
  cursor: pointer;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
</style>
