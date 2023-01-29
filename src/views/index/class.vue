<template>
  <!-- 顶部搜索栏 -->
  <HeaderSearch>
    <template #rightTime>
      <div class="rightSlot">
        <div class="selects">
          <el-select
            v-model="chosenYear"
            placeholder="全部学年"
            class="selecter"
            @change="getClassList()"
          >
            <el-option
              v-for="item in academicYear"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
          <el-select
            v-model="chosenSemester"
            placeholder="学期"
            class="selecter"
            @change="getClassList()"
          >
            <el-option
              v-for="item in semester"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
    </template>
  </HeaderSearch>
  <!-- 添加教学班按钮 -->
  <addBtn @click="dialogFormVisible = true"></addBtn>
  <!-- 弹出表单 -->
  <div>
    <el-dialog
      v-model="dialogFormVisible"
      title="新建教学班"
      width="580px"
      :show-close="false"
      :align-center="true"
    >
      <el-form
        :model="classAddForm"
        :rules="rules"
        ref="classAddForm"
        label-position="top"
      >
        <el-form-item
          label="课程名"
          :label-width="formLabelWidth"
          prop="className"
        >
          <el-input v-model="classAddForm.className" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="任课教师"
          :label-width="formLabelWidth"
          prop="instructor"
        >
          <el-input v-model="classAddForm.instructor" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="课程号"
          :label-width="formLabelWidth"
          prop="courseCode"
        >
          <el-input v-model="classAddForm.courseCode" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="开课号"
          :label-width="formLabelWidth"
          prop="identifier"
        >
          <el-input v-model="classAddForm.identifier" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="开课学年"
          :label-width="formLabelWidth"
          prop="chosenYear"
        >
          <el-select
            v-model="classAddForm.chosenYear"
            placeholder="选择开课学年"
          >
            <el-option
              v-for="item in academicYear"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开课学期"
          :label-width="formLabelWidth"
          prop="chosenSemester"
        >
          <el-select
            v-model="classAddForm.chosenSemester"
            placeholder="选择开课学期"
          >
            <el-option
              v-for="item in semester"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input
            :rows="2"
            type="textarea"
            v-model="classAddForm.remark"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addClass('classAddForm')">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 教学班展示列表 -->
  <el-table
    class="classesTable"
    :data="classTable"
    style="width: 70%"
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
    highlight-current-row
  >
    <el-table-column prop="className" label="课程名" width="200" />
    <el-table-column prop="teacherName" label="任课教师" width="150" />
    <el-table-column prop="courseCode" label="课程号" width="200" />
    <el-table-column prop="identifier" label="开课号" width="250px" />
    <el-table-column prop="academicYear" label="学年" width="150" />
    <el-table-column prop="semester" label="学期" width="130" />
    <el-table-column prop="remark" label="备注" width="130" />
    <el-table-column>
      <template #default="scope">
        <el-tooltip content="修改" :hide-after="0">
          <el-button
            link
            style="color: #3f51b5"
            @click="editClass(scope.$index, scope.row)"
            ><el-icon><Edit /></el-icon
          ></el-button>
        </el-tooltip>
        <el-tooltip content="删除" :hide-after="0">
          <el-button
            link
            style="color: #3f51b5"
            @click="deleteClass(scope.$index, scope.row)"
            ><el-icon><Delete /></el-icon
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->

  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      @current-change="handleCurrentChange"
      class="pagination"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      hide-on-single-page
    >
    </el-pagination>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import { getClass, addClass } from "@/api/class";
import { getDictionary } from "@/api/dictionary";
import addBtn from "@/components/general/addBtn.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  name: "Class",
  components: {
    HeaderSearch,
    addBtn,
    Edit,
    Delete,
  },
  data() {
    return {
      classTable: [],
      academicYear: [],
      semester: [],
      chosenYear: "",
      chosenSemester: "",
      currentInfo: {
        departmentId: Number,
      },
      dialogFormVisible: false,
      formLabelWidth: "140px",
      classAddForm: {
        className: "",
        instructor: "",
        courseCode: "",
        identifier: "",
        chosenYear: "",
        chosenSemester: "",
        remark: "",
      },
      rules: {
        className: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        instructor: [
          { required: true, message: "请输入任课教师", trigger: "blur" },
        ],
        courseCode: [
          { required: true, message: "请输入课程号", trigger: "blur" },
        ],
        identifier: [
          { required: true, message: "请输入开课号", trigger: "blur" },
        ],
        chosenYear: [
          { required: true, message: "请选择开课学年", trigger: "change" },
        ],
        chosenSemester: [
          { required: true, message: "请选择开课学期", trigger: "change" },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
    };
  },
  mounted() {
    //设置默认当前学院/专业等信息
    this.currentInfo.departmentId = this.$store.state.currentInfo.departmentId;
    this.getDictionary();
  },
  computed: {
    currentChange() {
      return this.$store.state.currentInfo;
    },
  },
  watch: {
    currentChange: {
      deep: true,
      handler(value) {
        this.currentInfo.departmentId =
          this.$store.state.currentInfo.departmentId;
        this.getClassList();
      },
    },
  },
  methods: {
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.academicYear = res.academic_year;
        this.semester = res.semester;
        this.getClassList();
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getClassList();
    },
    //获取教学班列表
    getClassList() {
      getClass(
        this.chosenYear,
        this.chosenSemester,
        this.currentInfo.departmentId,
        this.pageSize,
        this.currentPage
      ).then((res) => {
        console.log("getClassList", res);
        this.classTable = res.rows;
        this.total = res.total;
        if (this.classTable.length > 0) {
          for (let i = 0; i < this.classTable.length; i++) {
            this.academicYear.forEach((year) => {
              if (year.dictValue == this.classTable[i].academicYear) {
                this.classTable[i].academicYear = year.dictLabel;
              }
            });
            this.semester.forEach((semester) => {
              if (semester.dictValue == this.classTable[i].semester) {
                this.classTable[i].semester = semester.dictLabel;
              }
            });
          }
        }
      });
    },
    //新增教学班
    addClass(classAddForm) {
      this.$refs[classAddForm].validate((valid) => {
        if (valid) {
          addClass(
            this.classAddForm.chosenYear,
            this.classAddForm.chosenSemester,
            this.currentInfo.departmentId,
            this.classAddForm.className,
            this.classAddForm.identifier,
            this.classAddForm.instructor,
            this.classAddForm.courseCode,
            this.classAddForm.remark
          ).then((res) => {
            this.dialogFormVisible = false;
            console.log("addClass", res);
          });
        } else {
          console.log("error submit!!");
          return;
          // this.$refs[formName].resetFields();重置表单内容方法
        }
      });
    },
    //编辑教学班
    editClass(index, row) {
      console.log("index", index, "row", row);
      this.academicYear.forEach((year) => {
        if (year.dictLabel == row.academicYear) {
          row.academicYear = year.dictValue;
        }
      });
      this.semester.forEach((semester) => {
        if (semester.dictLabel == row.semester) {
          row.semester = semester.dictValue;
        }
      });
      this.classAddForm.className = row.className;
      this.classAddForm.instructor = row.teacherName;
      this.classAddForm.courseCode = row.courseCode;
      this.classAddForm.identifier = row.identifier;
      this.classAddForm.chosenYear = row.academicYear;
      this.classAddForm.chosenSemester = row.semester;
      this.classAddForm.remark = row.remark;
      this.dialogFormVisible = true;
    },
    //删除教学部
    deleteClass(index, row) {
      console.log("index", index, "row", row);
      ElMessageBox.confirm("是否确定删除该教学班?", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.classTable.pop(row);
      });
    },
  },
};
</script>

<style scoped>
.classesTable {
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.rightSlot {
  position: absolute;
  right: 10%;
  width: 300px;
  margin-top: 10px;
}
.selects {
  display: flex;
  flex-direction: row;
}
.selecter {
  margin-left: 15px;
}
:deep().el-dialog__title {
  color: #808080;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
.pagination {
  float: right;
}
.container {
  margin: 0 auto;
  width: 70%;
  margin-top:10px
}
:deep().el-pagination button:disabled{
  cursor: default;
}
:deep().el-icon{
  height: 18px;
  width: 18px;
}
:deep().el-icon svg{
  height: 18px;
  width: 18px;
}
:deep().searchBlock .el-icon{
  height: 24px;
  width: 24px;
}
:deep().searchBlock .el-icon svg{
  height: 24px;
  width: 24px;
}
</style>