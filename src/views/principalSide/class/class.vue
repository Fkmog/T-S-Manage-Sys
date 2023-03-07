<template>
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
  <div class="content">
    <!-- 教学班展示列表 -->
    <el-table
      class="classList"
      :data="classList"
      style="width: 1480px"
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
      <el-table-column prop="className" label="课程名" width="230" />
      <el-table-column prop="teacherName" label="任课教师" width="160" />
      <el-table-column prop="courseCode" label="课程号" width="200" />
      <el-table-column prop="identifier" label="开课号" width="220" />
      <el-table-column prop="academicYear" label="学年" width="180" />
      <el-table-column prop="semester" label="学期" width="180" />
      <el-table-column prop="remark" label="备注" width="160" />
      <el-table-column width="150">
        <template #default="scope">
          <el-tooltip content="修改" :hide-after="0">
            <el-button
              link
              style="color: #3f51b5"
              @click="editClass(scope.$index, scope.row)"
              ><el-icon><Edit /></el-icon
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出表单 -->
    <el-dialog
      v-model="dialogFormVisible"
      title="修改教学班"
      width="580px"
      :show-close="false"
      :align-center="true"
    >
      <el-form
        :model="classEditForm"
        :rules="rules"
        ref="classEditForm"
        label-position="top"
      >
        <el-form-item
          label="课程名"
          :label-width="formLabelWidth"
          prop="className"
        >
          <el-input v-model="classEditForm.className" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="任课教师"
          :label-width="formLabelWidth"
          prop="instructor"
        >
          <el-autocomplete
            style="width: 540px"
            v-model="classEditForm.instructor"
            hide-loading
            :fetch-suggestions="querySearch"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          label="课程号"
          :label-width="formLabelWidth"
          prop="courseCode"
        >
          <el-input v-model="classEditForm.courseCode" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="开课号"
          :label-width="formLabelWidth"
          prop="identifier"
        >
          <el-input v-model="classEditForm.identifier" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="开课学年"
          :label-width="formLabelWidth"
          prop="chosenYear"
        >
          <el-select
            v-model="classEditForm.chosenYear"
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
            v-model="classEditForm.chosenSemester"
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
            v-model="classEditForm.remark"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditClass(classEditForm)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import { Edit } from "@element-plus/icons-vue";
import { checkTeachers } from "@/api/teacher";
import { getDictionary } from "@/api/dictionary";
import { getPrincipalClassList } from "@/api/principal";
import { editClass } from "@/api/class";

export default {
  name: "PrincipalClass",
  components: {
    HeaderSearch,
    Edit,
  },
  data() {
    return {
      classList: [],
      allTeachers: [],
      dialogFormVisible: false,
      classEditForm: {
        className: "",
        instructor: "",
        courseCode: "",
        identifier: "",
        chosenYear: "",
        chosenSemester: "",
        remark: "",
      },
      currentInfo: {
        departmentId: Number,
        schoolId: Number,
      },
      formLabelWidth: "140px",
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
      },
      academicYear: [],
      semester: [],
      chosenYear: "",
      chosenSemester: "",
    };
  },
  computed: {
    teacherEditChange() {
      return this.classEditForm.instructor;
    },
  },
  watch: {
    teacherEditChange: {
      deep: true,
      handler(value) {
        if (value !== "") {
          this.goSearch(this.classEditForm.instructor);
        } else {
          this.allTeachers = [];
        }
      },
    },
  },
  mounted() {
    //设置默认当前学院/专业等信息
    this.currentInfo.departmentId = this.$store.state.currentInfo.departmentId;
    this.currentInfo.schoolId = this.$store.state.currentInfo.schoolId;
    this.getDictionary();
  },
  methods: {
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log(res)
        let year={}
        year.dictLabel = '全部学年'
        year.dictValue = null
        this.academicYear = res.academic_year;
        this.academicYear.unshift(year)
        let semester = {}
        semester.dictLabel = '全部学期'
        semester.dictValue = null
        this.semester = res.semester;
        this.semester.unshift(semester)
        this.getClassList();
      });
    },
    //查询教学班列表
    getClassList() {
      getPrincipalClassList(this.chosenYear, this.chosenSemester).then(
        (res) => {
          this.classList = res.data;
          console.log("getClassList", this.classList);
          if (this.classList.length > 0) {
            for (let i = 0; i < this.classList.length; i++) {
              this.academicYear.forEach((year) => {
                if (year.dictValue == this.classList[i].academicYear) {
                  this.classList[i].academicYear = year.dictLabel;
                }
              });
              this.semester.forEach((semester) => {
                if (semester.dictValue == this.classList[i].semester) {
                  this.classList[i].semester = semester.dictLabel;
                }
              });
            }
          }
        }
      );
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
      this.classEditForm.className = row.className;
      this.classEditForm.instructor = row.teacherName;
      this.classEditForm.courseCode = row.courseCode;
      this.classEditForm.identifier = row.identifier;
      this.classEditForm.chosenYear = row.academicYear;
      this.classEditForm.chosenSemester = row.semester;
      this.classEditForm.remark = row.remark;
      this.classEditForm.classId = row.classId;
      this.classEditForm.teacherName = row.teacherName;
      this.classEditForm.teacherNumber = row.teacherNumber;
      this.dialogFormVisible = true;
    },
    //提交修改教学班信息
    confirmEditClass(classEditForm) {
      classEditForm.academicYear = classEditForm.chosenYear;
      classEditForm.semester = classEditForm.chosenSemester;
      classEditForm.departmentId = this.currentInfo.departmentId;
      classEditForm.schoolId = this.currentInfo.schoolId;
      // console.log("修改后", classEditForm);
      editClass(classEditForm).then((res) => {
        console.log("confirmEditClass", res);
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.getClassList();
        }
      });
    },
    goSearch(searchTeacher) {
      this.allTeachers = [];
      // console.log("@", searchTeacher, this.currentInfo.departmentId);
      checkTeachers(
        this.currentInfo.departmentId,
        this.currentInfo.schoolId,
        searchTeacher
      ).then((res) => {
        // console.log("!!", res);
        this.allTeachers = res.data;
      });
    },
    //远程模糊搜索教师
    querySearch(queryString, cb) {
      var allTeachers = this.allTeachers;
      if (allTeachers.length > 0) {
        var results = queryString
          ? allTeachers.filter(this.createStateFilter(queryString))
          : allTeachers;
        results = allTeachers.map((item) => ({ value: item }));
        cb(results);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      }
    },
    //实现模糊搜索
    createStateFilter(queryString) {
      return (state) => {
        return;
        state.value.toUpperCase().match(queryString.toUpperCase());
      };
    },
  },
};
</script>

<style scoped>
.content {
  margin-top: 55px;
}
.classList {
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
:deep().el-icon {
  height: 18px;
  width: 18px;
}
:deep().el-icon svg {
  height: 18px;
  width: 18px;
}
:deep().searchBlock .el-icon {
  height: 24px;
  width: 24px;
}
:deep().searchBlock .el-icon svg {
  height: 24px;
  width: 24px;
}
:deep().el-dialog__title {
  color: #808080;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
</style>
