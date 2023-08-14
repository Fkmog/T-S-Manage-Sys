<template>
  <!-- 顶部搜索栏 -->
  <HeaderSearch msg="搜索课程名称" @SearchValue="getSearchValue">
    <template #rightTime>
      <div class="rightSlot" v-show="!showAdd">
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
            placeholder="全部学期"
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
          <el-select
            v-model="chosenStatus"
            placeholder="提交状态"
            class="status"
            @change="getClassList()"
          >
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="assignBtn" v-show="showAdd">
        <el-dropdown style="margin-top: 10px; cursor: pointer">
          <el-icon class="dropdownIcon"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="assignDetail()">
                设置课程大纲
              </el-dropdown-item>
              <el-dropdown-item @click="associateCourse()">
                关联课程库课程
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </HeaderSearch>
  <!-- 添加教学班按钮 -->
  <addBtn
    v-show="identity === '学院管理员'"
    @click="addVisible = true"
  ></addBtn>
  <!-- 弹出新建表单 -->
  <div>
    <el-dialog
      v-model="addVisible"
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
          :error="T_ErrorMsg"
        >
          <el-autocomplete
            style="width: 540px"
            v-model="classAddForm.instructor"
            :fetch-suggestions="querySearch"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          label="课程号"
          :label-width="formLabelWidth"
          prop="courseCode"
          :error="E_ErrorMsg"
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
              v-for="item in onlyAcademicYear"
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
              v-for="item in onlySemester"
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
          <el-button @click="goBatchAddClass">批量添加</el-button>
          <el-button @click="addVisible = false">取消</el-button>
          <el-button link plain @click="addClass(classAddForm)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 弹出修改表单 -->
  <div>
    <el-dialog
      v-model="editVisible"
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
          :error="T_ErrorMsg"
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
          :error="E_ErrorMsg"
        >
          <el-input v-model="classEditForm.courseCode" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="课程大纲版本"
          :label-width="formLabelWidth"
          prop="versionName"
        >
          <el-select
            v-model="classEditForm.versionName"
            placeholder="设置课程大纲"
          >
            <el-option
              v-for="item in this.detailList"
              :key="item.detailId"
              :label="item.versionName"
              :value="item.detailId"
            />
          </el-select>
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
              v-for="item in onlyAcademicYear"
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
              v-for="item in onlySemester"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          :label-width="formLabelWidth"
          prop="isRespondent"
        >
          <el-radio-group v-model="classEditForm.isRespondent" class="ml-4">
            <el-radio label="2">允许任课教师修改考核方式</el-radio>
            <el-radio label="0">不允许任课教师修改考核方式</el-radio>
          </el-radio-group>
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
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditClass(classEditForm)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 弹出分配课程大纲 -->
  <div class="assignDialog">
    <el-dialog
      v-model="isAssign"
      title="设置课程大纲"
      width="330px"
      :show-close="false"
      :align-center="true"
    >
      <el-select
        v-model="assignedDetail"
        style="width: 250px; margin-left: 20px"
        placeholder="选择课程大纲版本"
      >
        <el-option
          v-for="(datail, index) in detailList"
          :key="index"
          :label="datail.versionInfo"
          :value="datail.detailId"
        >
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isAssign = false">取消</el-button>
          <el-button type="primary" @click="confirmAssign()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 教学班展示列表 -->
  <el-table
    v-show="hasClass"
    ref="multipleTable"
    class="classesTable"
    :data="classTable"
    @selection-change="handleSelectionChange"
    @row-click="goCheck"
    style="width: 1400px"
    :header-cell-class-name="cellClass"
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
    :row-key="rowKey"
  >
    <el-table-column
      type="selection"
      width="50"
      :selectable="canSelect"
      :reserve-selection="true"
    >
    </el-table-column>
    <el-table-column prop="className" label="课程名" width="200" />
    <el-table-column prop="allTeacherName" label="任课教师" width="150" />
    <el-table-column prop="courseCode" label="课程号" width="150">
    </el-table-column>
    <el-table-column prop="versionName" label="大纲版本" width="120" />
    <el-table-column prop="identifier" label="开课号" width="270" />
    <el-table-column prop="academicYear" label="学年" width="140" />
    <el-table-column prop="semester" label="学期" width="120" />
    <el-table-column prop="isRespondent" label="" width="50">
      <template #default="scope">
        <div v-if="scope.row.isRespondent == 2">
          <el-tooltip content="允许任课教师修改考核方式" :hide-after="0">
            <el-button link style="color: #3f51b5; cursor: default"
              ><el-icon style="color: #3f51b5"><SetUp /></el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <span v-else></span>
      </template>
    </el-table-column>

    <el-table-column width="150">
      <template #default="scope">
        <el-row>
          <el-col :span="16">
            <el-row v-show="canAction">
              <el-col :span="12" v-show="identity === '学院管理员'">
                <el-tooltip content="修改" :hide-after="0">
                  <el-button
                    link
                    style="color: #3f51b5"
                    @click.stop="editClass(scope.$index, scope.row)"
                    ><el-icon><Edit /></el-icon
                  ></el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="12" v-show="identity === '学院管理员'">
                <el-tooltip content="删除" :hide-after="0">
                  <el-button
                    link
                    style="color: #3f51b5"
                    @click.stop="deleteClass(scope.$index, scope.row)"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" v-show="scope.row.courseIsDeleted === '2'">
            <el-row>
              <el-tooltip content="未关联课程库课程" :hide-after="0">
                <el-icon style="color: #9d2a2e; margin-top: 4px">
                  <Warning
                /></el-icon>
              </el-tooltip>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <div class="no-class" v-show="noClass">没有教学班</div>
  <div class="no-class-detail" v-show="noClass">
    请先点击右上角圆形按钮添加教学班
  </div>
  <!-- 分页 -->
  <div class="pagination-container" flex>
    <div class="loadMore">
      <el-button
        link
        plain
        v-show="hasClass && showLoadmore"
        @click="loadMore()"
        >加载更多</el-button
      >
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import {
  getClass,
  addClass,
  editClass,
  setPermission,
  deleteClass,
  associateCourses,
} from "@/api/class";
import { checkTeachers } from "@/api/teacher";
import { getDictionary } from "@/api/dictionary";
import addBtn from "@/components/general/addBtn.vue";
import {
  Edit,
  Delete,
  Plus,
  SetUp,
  Warning,
  MoreFilled,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getDetails, assign } from "@/api/basecourse";
import { getPrincipalClassList } from "@/api/principal";

export default {
  name: "Class",
  components: {
    HeaderSearch,
    addBtn,
    Edit,
    Delete,
    Plus,
    SetUp,
    Warning,
    MoreFilled,
  },
  data() {
    return {
      hasClass: false,
      noClass: false,
      canAction: true,
      isRespondent: "0",
      showLoadmore: true,
      isAssign: false,
      showAdd: false,
      keyword: "",
      detailList: [],
      assignedDetail: "",
      multipleSelection: [],
      selectedCourseId: "",
      canSelectAll: true,
      identity: "",
      searchTeacher: "",
      allTeachers: [],
      classTable: [],
      academicYear: [],
      semester: [],
      status: [
        {
          value: null,
          label: "全部",
        },
        {
          value: 1,
          label: "未提交",
        },
        {
          value: 2,
          label: "已提交",
        },
        {
          value: 3,
          label: "已审核",
        },
        {
          value: 4,
          label: "已退回",
        },
      ],
      onlyAcademicYear: [],
      onlySemester: [],
      chosenYear: "",
      chosenSemester: "",
      chosenStatus: "",
      currentInfo: {
        departmentId: Number,
        schoolId: Number,
      },
      addVisible: false,
      editVisible: false,
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
      classEditForm: {
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
      },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      E_ErrorMsg: "",
      T_ErrorMsg: "",
    };
  },
  mounted() {
    //设置默认当前学院/专业等信息
    this.currentInfo.departmentId = this.$store.state.currentInfo.departmentId;
    this.currentInfo.schoolId = this.$store.state.currentInfo.schoolId;
    this.identity = this.$store.state.currentInfo.identity;
    console.log("this.identity", this.identity);
    this.getDictionary();
  },
  computed: {
    currentChange() {
      return this.$store.state.currentInfo;
    },
    teacherAddChange() {
      return this.classAddForm.instructor;
    },
    teacherEditChange() {
      return this.classEditForm.instructor;
    },
    multipleSelectionChange() {
      return this.multipleSelection;
    },
  },
  watch: {
    currentChange: {
      deep: true,
      handler(value) {
        this.currentInfo.departmentId =
          this.$store.state.currentInfo.departmentId;
        this.identity = this.$store.state.currentInfo.identity;
        this.getClassList();
      },
    },
    teacherAddChange: {
      deep: true,
      handler(value) {
        if (value !== "") {
          this.goSearch(this.classAddForm.instructor);
        } else {
          this.allTeachers = [];
        }
      },
    },
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
    multipleSelectionChange: {
      deep: true,
      handler(value) {
        if (value.length > 0) {
          this.assignedDetail = "";
          this.getDetailList();
          this.showAdd = true;
        } else {
          this.assignedDetail = "";
          this.showAdd = false;
        }
      },
    },
  },
  methods: {
    //跳转到审核页面
    goCheck(row) {
      console.log("row:", row);
      if (this.identity == "学院管理员") {
        this.$store.commit("currentInfo/setadminSideClassInfo", row);
      } else if (this.identity == "课程负责人") {
        this.$store.commit("currentInfo/setRespondClassInfo", row);
      } else {
        this.$store.commit("currentInfo/setTeacherSideClassInfo", row);
      }
      this.$router.push({ name: "TeacherClass" });
    },
    //跳转到批量添加
    goBatchAddClass() {
      this.$router.push({ path: "/batchClassAdd" });
    },
    // 搜索栏查询
    getSearchValue(data) {
      this.keyword = data;
      console.log("keyword", this.keyword, this.currentInfo.schoolId);
      this.getClassList();
    },
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.academicYear = res.academic_year;
        this.semester = res.semester;
        //修改，新增教学班时使用
        this.onlyAcademicYear = JSON.parse(JSON.stringify(res.academic_year));
        this.onlySemester = JSON.parse(JSON.stringify(res.semester));
        //头部栏筛选使用
        let year = {};
        year.dictLabel = "全部学年";
        year.dictValue = null;
        this.academicYear.unshift(year);
        let semester = {};
        semester.dictLabel = "全部学期";
        semester.dictValue = null;
        this.semester.unshift(semester);
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
      if (this.identity === "学院管理员") {
        getClass(
          this.chosenYear,
          this.chosenSemester,
          this.currentInfo.departmentId,
          this.currentInfo.schoolId,
          this.pageSize,
          this.pageNum,
          this.keyword,
          this.chosenStatus
        ).then((res) => {
          console.log("getClassList", res);
          if (res.code === "SUCCESS") {
            this.classTable = res.rows;
            if (this.classTable.length == 0) {
              this.noClass = true;
              this.hasClass = false;
            } else {
              this.hasClass = true;
              this.noClass = false;
            }
            this.total = res.total;
            if (this.pageSize >= res.total) {
              this.showLoadmore = false;
            } else {
              this.showLoadmore = true;
            }
            if (this.classTable.length > 0) {
              for (let i = 0; i < this.classTable.length; i++) {
                this.classTable[i].allTeacherName =
                  this.classTable[i].teacherName;
                if (this.classTable[i].additionalTeacherList !== null) {
                  this.classTable[i].additionalTeacherList.forEach(
                    (teacher) => {
                      this.classTable[i].allTeacherName =
                        this.classTable[i].allTeacherName +
                        "," +
                        teacher.teacherName;
                    }
                  );
                }

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
            // console.log("#", this.classTable);
          }
        });
      }
      if (this.identity === "课程负责人") {
        getPrincipalClassList(
          this.chosenYear,
          this.chosenSemester,
          this.pageSize,
          this.pageNum
        ).then((res) => {
          console.log("getClassList", res);
          if (res.code === "SUCCESS") {
            this.classTable = res.rows;
            if (this.classTable.length == 0) {
              this.noClass = true;
              this.hasClass = false;
            } else {
              this.hasClass = true;
              this.noClass = false;
            }
            this.total = res.total;
            if (this.pageSize >= res.total) {
              this.showLoadmore = false;
            } else {
              this.showLoadmore = true;
            }
            if (this.classTable.length > 0) {
              for (let i = 0; i < this.classTable.length; i++) {
                this.classTable[i].allTeacherName =
                  this.classTable[i].teacherName;
                if (this.classTable[i].additionalTeacherList !== null) {
                  this.classTable[i].additionalTeacherList.forEach(
                    (teacher) => {
                      this.classTable[i].allTeacherName =
                        this.classTable[i].allTeacherName +
                        "," +
                        teacher.teacherName;
                    }
                  );
                }

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
            // console.log("#", this.classTable);
          }
        });
      }
    },
    //新增教学班
    addClass(classAddForm) {
      this.$refs["classAddForm"].validate((valid) => {
        if (valid) {
          //error信息处理
          this.T_ErrorMsg = "";
          this.E_ErrorMsg = "";
          console.log("classAddForm", classAddForm);
          let array = classAddForm.instructor.split("(");
          let teacherName = array[0];
          let teacherNumber = array[1].substr(0, array[1].length - 1);
          addClass(
            this.classAddForm.chosenYear,
            this.classAddForm.chosenSemester,
            this.currentInfo.departmentId,
            this.classAddForm.className,
            this.classAddForm.identifier,
            teacherName,
            teacherNumber,
            this.classAddForm.courseCode,
            this.classAddForm.remark,
            this.currentInfo.schoolId
          )
            .then((res) => {
              this.addVisible = false;
              console.log("addClass", res);
              this.getClassList();
            })
            .catch((e) => {
              if (e.code === "E_CODE_NOT_EXIST") {
                ElMessage({
                  type: "error",
                  message: "课程号不存在",
                  duration: 1500,
                });
                this.E_ErrorMsg = "课程号不存在，请重新输入";
              } else if (e.code === "E_TEACHER_NOT_EXIST") {
                ElMessage({
                  type: "error",
                  message: "教师不存在",
                  duration: 1500,
                });
                this.T_ErrorMsg = "教师不存在，请重新输入";
              }
            });
        } else {
          ElMessage({
            type: "error",
            message: "请输入完整信息",
            duration: 1500,
          });
          return;
        }
      });
    },
    //编辑教学班
    editClass(index, row) {
      console.log("index", index, "row", row);
      //获取detailList
      getDetails(
        row.courseId,
        this.currentInfo.departmentId,
        this.currentInfo.schoolId
      ).then((res) => {
        console.log("getDetailList", res);
        this.detailList = res.rows;
      });
      // console.log("@#",this.onlyAcademicYear);
      this.onlyAcademicYear.forEach((year) => {
        if (year.dictLabel == row.academicYear) {
          row.academicYear = year.dictValue;
        }
      });
      this.onlySemester.forEach((semester) => {
        if (semester.dictLabel == row.semester) {
          row.semester = semester.dictValue;
        }
      });
      //修改表单信息初始化
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
      this.classEditForm.versionName = row.versionName;
      this.classEditForm.isRespondent = row.isRespondent;
      this.editVisible = true;
      this.onlyAcademicYear.forEach((year) => {
        if (year.dictValue == row.academicYear) {
          row.academicYear = year.dictLabel;
        }
      });
      this.onlySemester.forEach((semester) => {
        if (semester.dictValue == row.semester) {
          row.semester = semester.dictLabel;
        }
      });
    },
    //提交修改教学班信息
    confirmEditClass(classEditForm) {
      //error信息处理
      this.E_ErrorMsg = "";
      this.T_ErrorMsg = "";
      classEditForm.academicYear = classEditForm.chosenYear;
      classEditForm.semester = classEditForm.chosenSemester;
      classEditForm.departmentId = this.currentInfo.departmentId;
      classEditForm.schoolId = this.currentInfo.schoolId;
      // this.classEditForm.isRespondent = this.isRespondent
      this.giveRespondentPermission(classEditForm);
      // console.log("修改后", classEditForm);
      editClass(classEditForm)
        .then((res) => {
          console.log("confirmEditClass", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: "修改成功",
              duration: 1500,
            });
            this.editVisible = false;
            this.getClassList();
          }
        })
        .catch((e) => {
          console.log("3", e);
          if (e.code === "E_CODE_NOT_EXIST") {
            ElMessage({
              type: "error",
              message: "课程号不存在",
              duration: 1500,
            });
            this.E_ErrorMsg = "课程号不存在，请重新输入";
          } else if (e.code === "E_TEACHER_NOT_EXIST") {
            ElMessage({
              type: "error",
              message: "教师不存在",
              duration: 1500,
            });
          }
        });
    },
    //删除教学班
    deleteClass(index, row) {
      console.log("index", index, "row", row);
      ElMessageBox.confirm("是否确定删除该教学班?", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteClass(row.classId).then((res) => {
          console.log("deleteClass", res);
          ElMessage({
            type: "success",
            message: "删除成功",
            duration: 1500,
          });
          this.getClassList();
        });
      });
    },
    //远程模糊搜索教师
    goSearch(searchTeacher) {
      this.allTeachers = [];
      // console.log("@", searchTeacher);
      checkTeachers(
        this.currentInfo.departmentId,
        this.currentInfo.schoolId,
        searchTeacher
      ).then((res) => {
        // console.log("!!", res);
        this.allTeachers = res.data;
      });
    },
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
    // 多选框设置
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
      if (this.multipleSelection.length > 0) {
        this.selectedCourseId = this.multipleSelection[0].courseId;
        this.canAction = false;

        // console.log("this.selectedCourseId", this.selectedCourseId);
        this.canSelectAll = false;
      } else {
        this.selectedCourseId = "";
        this.canSelectAll = true;
        this.canAction = true;
      }
    },
    //disable控制
    canSelect(row, index) {
      if (this.selectedCourseId == "") {
        return true;
      } else {
        if (row.courseId == this.selectedCourseId) {
          return true;
        } else {
          return false;
        }
      }
    },
    //视图控制
    cellClass(row) {
      if (this.canSelectAll && row.columnIndex == 0) {
        return "DisableSelection";
      }
    },
    //获取detailId列表
    getDetailList() {
      getDetails(
        this.multipleSelection[0].courseId,
        this.currentInfo.departmentId,
        this.currentInfo.schoolId
      ).then((res) => {
        console.log("getDetailList", res);
        this.detailList = res.rows;
        this.detailList.forEach((item) => {
          item.versionInfo = item.courseName + "-" + item.versionName;
        });
      });
    },
    //分配课程大纲
    assignDetail() {
      // console.log("123", this.multipleSelection);
      this.isAssign = true;
    },
    //确定分配课程大纲
    confirmAssign() {
      console.log("confirmAssign");
      // console.log("@#",this.assignedDetail,this.multipleSelection);
      this.multipleSelection.forEach((item) => {
        item.detailId = this.assignedDetail;
      });
      assign(this.multipleSelection).then((res) => {
        // console.log("assign",res);
        if (res.code === "SUCCESS") {
          this.isAssign = false;
          ElMessage({
            type: "success",
            message: "设置成功",
            duration: 1500,
          });
          this.multipleSelection = [];
          this.$refs.multipleTable.clearSelection();
          this.getClassList();
        } else {
          ElMessage({
            type: "error",
            message: "设置失败",
            duration: 1500,
          });
        }
      });
    },
    //关联课程库课程
    associateCourse() {
      console.log(" this.multipleSelection", this.multipleSelection);
      associateCourses(this.multipleSelection)
        .then((res) => {
          console.log("associateCourses", res);
          if (res.code === "SUCCESS") {
            ElMessage({
              type: "success",
              message: "关联成功",
              duration: 1500,
            });
            this.multipleSelection.forEach((item) => {
              item.courseIsDeleted = "0";
            });
            // this.getClassList()
          }
        })
        .catch((e) => {
          console.log("e", e);
          if (e.code === "CODE_NOT_EXIST") {
            ElMessage({
              type: "error",
              message: "请先添加课程库课程",
              duration: 1500,
            });
          }
        });
    },
    //加载更多
    loadMore() {
      if (this.total - this.pageSize >= 20) {
        this.pageSize += 20;
        this.getClassList();
      } else {
        this.pageSize += this.total - this.pageSize;
        this.getClassList();
      }
    },
    rowKey(row) {
      return row.classId;
    },
    //设置是否允许任课老师修改考核方式
    giveRespondentPermission(classEditForm) {
      let msg = {};
      msg.classId = classEditForm.classId;
      msg.departmentId = this.currentInfo.departmentId;
      msg.isRespondent = classEditForm.isRespondent;
      msg.schoolId = this.currentInfo.schoolId;
      let arr = [];
      arr.push(msg);
      setPermission(arr).then((res) => {
        console.log("setPermission", res);
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
  width: 440px;
  margin-top: 10px;
}
.assignBtn {
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
  width: 120px;
}
.status {
  margin-left: 15px;
  width: 120px;
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
  margin-top: 10px;
}
:deep().el-pagination button:disabled {
  cursor: default;
}
:deep() .el-icon {
  height: 18px;
  width: 18px;
}
:deep() .el-icon svg {
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
:deep().el-checkbox__input.is-disabled .el-checkbox__inner {
  cursor: default;
}
.el-table :deep().DisableSelection .cell .el-checkbox__inner {
  display: none;
}
:deep().el-input__wrapper {
  border-bottom: 1px solid #d5d5d5;
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  box-shadow: 0 0 0 0px;
  border-radius: 0;
}
.el-select:hover:not(.el-select--disabled) :deep().el-input__wrapper {
  box-shadow: 0 0 0 0px;
}
.no-class {
  padding-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
  background-color: #f2f2f2;
}
.no-class-detail {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 13px;
  color: #828d96;
}
.loadMore {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
