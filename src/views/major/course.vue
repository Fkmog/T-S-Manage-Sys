<template>
  <div v-show="hasProgram">
    <div v-show="hasCourse">
      <HeaderSearch
        msg="搜索课程名称"
        v-show="!closeShow"
        @SearchValue="getSearchValueformProgram"
      >
        <template #rightTime>
          <div class="rightSlot">
            <div class="selectionBar">
              <el-select
                v-model="option1.value"
                class="selecter"
                placeholder="更新时间⬇"
                @change="selectionOption1"
              >
                <el-option
                  v-for="item in option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              /></el-select>
              <el-select
                v-model="option2.value"
                class="selecter"
                placeholder="全部"
                @change="selectionOption2"
              >
                <el-option
                  v-for="item in option2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              /></el-select>
            </div>
          </div>
        </template>
      </HeaderSearch>

      <div v-show="closeShow" class="submenu">
        <el-row class="rowStyle">
          <el-col :span="2">
            <el-button
              @click="this.toggleSelection()"
              style="float: right"
              class="clearSelected"
              >取消选择</el-button
            >
          </el-col>
          <el-col :span="16">
            <div class="numSelectedCourse">
              已选中 {{ numSelected }} 门课程
            </div>
          </el-col>
          <el-col :span="4">
            <el-dropdown class="dropdownstyle">
              <el-icon class="dropdownIcon"><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="this.deleteBaseCourse()">
                    <el-icon><Delete /></el-icon>
                    &nbsp;删除课程
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>

<div layout="row" flex class="md-padding" >
    
    <addBtn @click="this.drawerShow()"></addBtn>
    <div class="el-table-container">
      <el-table 
      :data="drawertableData"  
      ref="multipleTable" 
      style="width: 1135px;"
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
      'text-overflow': 'ellipsis',
       'white-space': 'nowrap',
       cursor: 'pointer',
    }"
   
    :row-key="rowKey"
    @row-click="goBaseCourseDetail"
    @selection-change="handleSelectionChange">
        <el-table-column  type="selection" width="55" column-key="select" :reserve-selection="true" />
        <el-table-column prop="courseName" label="课程名" width="180" />           
        <el-table-column prop="courseCode" label="课程号" width="180" />
        <el-table-column prop="courseType" label="课程类型" width="180" />
        <el-table-column prop="courseNature" label="课程性质" width="180" />
        <el-table-column prop="credit" label="学分" width="180" />
        <el-table-column prop="versionName" label="版本"  width="180"/>
      </el-table>
   </div>
  </div>

      <el-dialog v-model="dialogFormVisible1" title="修改基础课程">
        <el-form :model="preform">
          <el-form-item label="课程名称" :label-width="formLabelWidth">
            <el-input v-model="preform.courseName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="课程代码" :label-width="formLabelWidth">
            <el-input v-model="preform.courseCode" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学分" :label-width="formLabelWidth">
            <el-input v-model="preform.credit" autocomplete="off" />
          </el-form-item>
          <el-form-item label="课程性质" :label-width="formLabelWidth">
            <el-select
              v-model="preform.courseNature"
              placeholder="请选择课程性质"
            >
              <el-option label="专业任选" value="0" />
              <el-option label="还未确定" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" :label-width="formLabelWidth">
            <el-select
              v-model="preform.courseType"
              placeholder="请选择课程类型"
            >
              <el-option label="学科基础课" value="0" />
              <el-option label="还未确定" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="学年" :label-width="formLabelWidth">
            <el-select v-model="preform.courseYear" placeholder="请选择学年">
              <el-option label="2022" value="0" />
              <el-option label="2023" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="preform.remark" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取消</el-button>
            <el-button type="primary" @click="editBaseCourse"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-show="!hasCourse" class="no-program">
      <HeaderSearch
        v-show="!closeShow"
        @SearchValue="getSearchValueformProgram"
      ></HeaderSearch>

      <div layout="row" flex class="md-padding">
        <addBtn @click="this.drawerShow()"></addBtn>
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 100px;
          font-size: 22px;
        "
      >
        没有课程
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
        请先点击右上角圆形按钮添加课程
      </div>
    </div>

    <el-drawer
      v-model="drawer"
      :direction="direction"
      size="690"
      :show-close="true"
    >
      <template #header="{ titleId, titleClass }">
        <el-row :id="titleId" :class="titleClass">
          <el-row style="width: 100%">
            <el-col :span="17">
              <el-row style="width: 200px">
                <HeaderSearch
                  class="searchIndrawer"
                  msg="搜索课程名称"
                  @SearchValue="getSearchValue"
                ></HeaderSearch>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-select
                  v-model="currentVersion"
                  @change="getCourseByYear(currentVersion)"
                >
                  <el-option
                    v-for="item in versions"
                    :key="item.versionId"
                    :label="item.label"
                    :value="item.versionId"
                  />
                </el-select>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="drawersubmenu">
            <el-col :span="16">
              <div style="margin-top: 7px;width: 150px;">
                已选中
                {{ drawernumSelected - programInfoCourseCount }} 节基础课程
              </div>
            </el-col>
            <el-col :span="1">
              <div style="width:1px">

              </div>
            </el-col>
            <el-col :span="3" class="drawerdeleteButton">
              <el-button 
              @click="this.getBCMId()"
              v-show="drawernumSelected - programInfoCourseCount"
                ><el-icon><Plus class="iconSize" /></el-icon
              ></el-button>
            </el-col>
          </el-row>
        </el-row>
      </template>

      <!-- 具体basecourse页面，分页 可搜索-->
      <div class="drawerBlock" flex>
        <div>
          <el-table
            :data="tableData"
            ref="drawermultipleTable"
            style="cursor: pointer"
            width="645"
            @selection-change="drawerchandleSelectionChange"
            :row-key="rowKey"
            
          >
            <el-table-column
              width="55"
              type="selection"
              :selectable="selectable"
              :reserve-selection="true"
              column-key="select"
            >
            </el-table-column>
            <el-table-column prop="courseName" label="课程名" width="180" />
            <el-table-column prop="courseCode" label="课程号" width="130" />
            <el-table-column
              prop="respondentName"
              label="课程负责人"
              width="120"
            />
            <el-table-column label="课程大纲" width="150">
              <template #default="scope">
                <!-- <el-tooltip content="查看课程大纲">
                  <el-button
                    v-show="scope.row.versionId"
                    @click="goBaseCourseDetail(scope.row)"
                    class="deleteButton"
                    link
                    style="color: #3f51b5"
                    ><el-icon><Document /></el-icon
                  ></el-button>
                </el-tooltip> -->
                <!-- <div v-show="scope.row.versionId">{{ currentVersionName }}</div> -->
                  <el-tag v-show="scope.row.versionId"  type="prime">
                      {{ currentVersionName }}
                  </el-tag>
                <el-tooltip content="添加课程大纲">
                  <el-tag
                    v-show="!scope.row.versionId"
                    type="danger"
                    @click.stop="addBaseCourseDetail(scope.row)">
                    无课程大纲
                  </el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div style="flex: auto" class="drawerFooter">
        <div class="pagination-container" flex>
          <el-row
            type="flex"
            justify="center"
            align="middle"
            class="loadmorestyle"
          >
            <el-button
              :disabled="loadmoreDisabled"
              link
              plain
              v-show="showLoadmore"
              @click="loadmoreCourse()"
              >加载更多</el-button
            >
          </el-row>
        </div>
      </div>
    </el-drawer>
  </div>
  <div v-show="!hasProgram" class="no-program">
    <div
      style="
        display: flex;
        justify-content: center;
        margin-top: 100px;
        font-size: 22px;
      "
    >
      未创建培养方案
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        color: grey;
        margin-top: 30px;
        font-size: 13px;
      "
    >
      请先创建培养方案
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref, reactive } from "vue";
import {
  ElIcon,
  ElButton,
  ElTable,
  ElMessage,
  ElMessageBox,
  ElDialog,
  ElSelect,
  ElOption,
  ElTag,
  ElCheckbox,
  ElDropdown,
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
  Document,
  MoreFilled,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
import request from "@/utils/request/request";
import { getDictionary } from "@/api/dictionary";
import { checkProgram } from "@/api/program";

export default {
  name: "Courses",
  components: {
    HeaderSearch,
    ElIcon,
    ElButton,
    ElTable,
    ElMessage,
    ElMessageBox,
    ElDialog,
    ElSelect,
    ElOption,
    Back,
    FolderChecked,
    InfoFilled,
    Loading,
    Search,
    Close,
    Plus,
    Delete,
    Edit,
    addBtn,
    ElTag,
    ElCheckbox,
    Document,
    ElDropdown,
    MoreFilled,
    CircleCloseFilled,
  },
  data() {
    return {
      loadmoreDisabled: Boolean,
      currentVersionName:'',

      courseTypeSource: [],
      courseNatureSource: [],
      keyword: "",
      keywordforProgrameCourse: "",
      //show loadmore
      showLoadmore: true,

      //是否有program
      hasProgram: Boolean,
      //课程是否为空
      hasCourse: Boolean,
      //checkbox
      checkList: ref([" "]),

      //programeInfo
      programeInfo: [],
      programInfoCourseId: [0, 0],
      programInfoCourseCount: 0,

      //需要删除的信息
      deleteProgrameInfo: [
        {
          bcdmId: 0,
          courseId: 0,
          detailId: 0,
          groupId: 0,
          programId: 0,
        },
      ],
      //programe中已经添加的课程
      programeCourseInfo: [
        {
          courseId: 0,
          versionId: 0,
        },
      ],
      //drawer
      drawer: false,
      direction: "ltr",
      drawercloseShow: ref(false),
      drawermultipleSelection: [],
      drawernumSelected: 0,
      drawerclickState: 0,
      drawercourseId: [], //clear after add,
      drawerCourseIndex: [], //clear after add,
      drawerresult: reactive({}),
      drawertableData: [
        {
          courseName: "",
          courseCode: "",
          courseType: "",
          courseNature: "",
          credit: "",
          courseYear: "",
          remark: "",
        },
      ],
      origintableData: [
        {
          courseName: "",
          courseCode: "",
          courseType: "",
          courseNature: "",
          credit: "",
          courseYear: "",
          remark: "",
        },
      ],

      //学校部门专业信息
      departmentId: "",
      schoolId: "",
      majorId: Number,
      majorName: "",
      programId: "",

      closeShow: ref(false),
      multipleSelection: [],
      numSelected: 0,
      clickState: 0,

      //对话框信息
      dialogFormVisible: ref(false),
      dialogFormVisible1: ref(false),
      formLabelWidth: "140px",
      form: reactive({
        courseName: "",
        courseCode: "",
        courseType: "",
        courseNature: "",
        credit: "",
        courseYear: "",
        remark: "",
      }),

      preform: reactive({
        courseName: "",
        courseCode: "",
        courseType: "",
        courseNature: "",
        credit: "",
        courseYear: "",
        remark: "",
      }),

      //el-table
      tableData: [
        {
          courseName: "",
          courseCode: "",
          courseType: "",
          courseNature: "",
          credit: "",
          courseYear: "",
          remark: "",
        },
      ],

      //分页参数
      pageSize: ref(20),
      pageNum: ref(1),

      //搜索
      searchItems: {
        programId: "",
        courseId: "",
        courseName: "",
      },
      sortBy: {
        option1: "",
        option2: "",
      },
      searchCourseId: [0, 0],

      currentVersion: "",
      currentVersionValue: 1,
      currentVersionId: "",
      versions: [],
      versionLabel: [],

      result: reactive({}),
      option1: [
        {
          value: "更新时间",
          label: "更新时间⬇",
        },
        {
          value: "创建时间",
          label: "创建时间⬇",
        },
        {
          value: "名称",
          label: "名称",
        },
      ],
      option2: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "已完成设置",
          label: "已完成设置",
        },
        {
          value: "未完成设置",
          label: "未完成设置",
        },
        {
          value: "回收站",
          label: "回收站",
        },
      ],
    };
  },
  methods: {
    drawerClose() {
      this.$refs.drawermultipleTable.clearSelection();
      this.drawer = false;
    },
    getSearchValueformProgram(data) {
      console.log("searching for class");
      this.keywordforProgrameCourse = data;
      this.getProgramCourse();
    },
    async getDict() {
      let that = this;
      let num = 1;
      this.versions = [];
      this.versionLabel = [];
      getDictionary().then((res) => {
        console.log("Dict:", res);
        res.course_nature.forEach((nature) => {
          that.courseNatureSource.push(nature.dictLabel);
        });
        res.course_type.forEach((type) => {
          that.courseTypeSource.push(type.dictLabel);
        });
        return request({
          url: "detail/versionList",
          method: "get",
        })
          .then((res) => {
            console.log("versionList:", res);

            if (res.code == "SUCCESS" && res.data.length) {
              that.hasVersion = true;
              that.hasNoVersion = false;
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

              that.currentVersionId = this.$store.state.course
                .baseCourseVersionId
                ? this.$store.state.course.baseCourseVersionId
                : that.versions[0].versionId;
              console.log(
                "baseCourseVersionId",
                this.$store.state.course.baseCourseVersionId,
                "that.versions[0].versionId",
                that.versions[0].versionId
              );
              for (const element of that.versions) {
                if (element["versionId"] == that.currentVersionId) {
                  console.log("find same ");
                  that.currentVersion = element["label"];
                  that.currentVersionName = element["label"];
                }
              }
            } else {
              that.hasVersion = false;
              that.hasNoVersion = true;
              ElMessage({
                type: "error",
                message: `没有版本信息，请先添加版本！`,
                duration: 1500,
              });
            }
          })
          .catch((e) => {
            console.log("error:", e);
          });

        // that.courseTypeSource = res.
      });
    },
    getSearchValue(data) {
      this.keyword = data;
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    getSearchValueforClass(data) {
      this.keyword = data;
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    rowKey(row) {
      return row.courseId;
    },
    //直接添加课程大纲
    addBaseCourseDetail(row) {
      if (this.currentVersionId) {
        let that = this;
        for (const element of this.versions) {
          if (element["versionId"] == that.currentVersionId) {
            console.log("find same ");
            that.currentVersion = element["label"];
            that.currentVersionName = element["label"];
          }
        }
        console.log("currentVersionName", this.currentVersionName);
        let versionMessage =
          "是否确认添加课程大纲（版本：" + this.currentVersion + " ）?";
        ElMessageBox.confirm(versionMessage, "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          console.log(
            "versionId",
            that.currentVersionId,
            "CourseId",
            that.courseId
          );

          return request({
            url: "/detail",
            method: "post",
            data: {
              versionId: that.currentVersionId,
              courseId: row.courseId,
              departmentId: that.departmentId,
              schoolId: that.schoolId,
            },
          })
            .then(function (res) {
              console.log(res);
              if (res.code == "SUCCESS") {
                ElMessage({
                  type: "success",
                  message: `新建成功`,
                  duration: 1500,
                });
                //成功后根据vesionId和basecouseId获取详细信息
                that.getBaseCourse(that.pageSize, that.pageNum);
              }
              if (
                res.code == "UNPROCESSABLE ENTITY" &&
                res.msg == "UNPROCESSABLE ENTIT"
              ) {
                ElMessage({
                  type: "error",
                  message: `没有选择课程大纲版本`,
                  duration: 1500,
                });
                //成功后根据vesionId和basecouseId获取详细信息
                that.getBaseCourse(that.pageSize, that.pageNum);
              }
            })
            .catch((e) => {
              console.log("e", e);
              ElMessage({
                type: "error",
                message: `新建失败`,
                duration: 1500,
              });
              //失败后退回basecouse页面
              that.getBaseCourse(that.pageSize, that.pageNum);
            });
        });
      } else {
        ElMessage({
          type: "error",
          message: `请选择课程大纲！`,
          duration: 1500,
        });
      }
    },
    //load course
    loadmoreCourse() {
      if (this.result.total - this.pageSize >= 20) {
        this.pageSize += 20;
        this.getBaseCourse(this.pageSize, this.pageNum);
      } else {
        this.pageSize += this.result.total - this.pageSize;
        this.getBaseCourse(this.pageSize, this.pageNum);
      }
    },
    //跳转到详细页面
    goBaseCourseDetail(row, column) {
      console.log('row',row,"bcdmid",row.bcDetails[0].bcDetailProgramVoList[0].bcdmId);
      this.$store.commit("baseCourseDetailProgram/setmajorbcdmId", row.bcDetails[0].bcDetailProgramVoList[0].bcdmId);
      this.$store.commit("baseCourseDetailProgram/setmajorclassId", row.courseId);
      this.$store.commit("baseCourseDetailProgram/setmajorcourseCode", row.courseCode);
      this.$router.push('/courseDetail');
    },
    //是否有program
    async checkProgram() {
      if (this.$store.state.major.programId) {
        this.hasProgram = true;
      } else {
        this.hasProgram = false;
      }
      console.log("hasProgram", this.hasProgram);
    },

    //drawer show
    drawerShow() {
      let that = this;
      console.log("drawerShow:");
      this.drawer = true;

      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    //是否可选
    selectable(row, index) {
      if (row.remark) {
        return !row.remark;
      }
      if (!row.versionId) {
        return row.versionId;
      } else return true;
    },
    //根据version和courseId来确定detailId
    getDetail(courseId) {
      let that = this;
      let coursedetaiId = "";
      return request({
        url:
          "/detail/list" +
          "?vesionId=" +
          this.currentVersionId +
          "&courseId=" +
          courseId,
        method: "get",
      }).then(function (res) {
        console.log("getDetail:", res);
        res.rows.forEach(function (detail) {
          if (detail.versionId == that.currentVersionId) {
            console.log("detailId", detail.detailId);
            coursedetaiId = detail.detailId;
          }
        });
        return coursedetaiId;
      });
    },
    // addBaseCourseDetail(row){
    //   let that = this;
    //   console.log('route push '+'versionValue:',that.currentVersionValue,'courseId:',row.courseId)
    //   ElMessageBox.confirm(
    //   '尚未添加版本信息是否添加？',
    //   '注意',
    //   {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }
    // ).then(() => {
    //   this.$router.push({
    //     path:'/baseCourse',
    //     query:{
    //       versionId:that.currentVersionValue,
    //       courseId:row.courseId,
    //     }
    // })
    //   })
    // },
    getCourseByYear(label) {
      this.currentVersionId = label;
      this.$store.commit(
        "course/setbaseCourseVersionId",
        this.currentVersionId
      );
      for (const element of this.versions) {
        if (element["versionId"] == this.currentVersionId) {
          this.currentVersionName = element["label"];
        }
      }
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    getProgramCourse() {
      let that = this;
      that.drawertableData = [];
      that.origintableData = [];
      let courses = [];
      let eachCourse = [];
      let CourseId = [];
      console.log(
        "currentprogramId:",
        this.programId,
        "keyword:",
        this.keywordforProgrameCourse
      );
      return request({
        url: "/baseCourse/program",
        method: "get",
        params: {
          schoolId: that.schoolId,
          departmentId: that.departmentId,
          programId: that.programId,
          selectKeyWord: that.keywordforProgrameCourse,
        },
      })
        .then(function (res) {
          console.log("courseInPrograme:", res);
          console.log(
            "department:",
            that.departmentId,
            "schoolId:",
            that.schoolId,
            "majorId:",
            that.majorId
          );

          if (res.total) {
            res.rows.forEach(function (course) {
              that.hasCourse = true;
              let eachCourseId = "";

              eachCourseId = course.courseId;

              course.courseName = course.courseName;
              course.courseCode = course.courseCode;

              course.courseType = that.courseTypeSource[course.courseType];
              course.courseNature =
                that.courseNatureSource[course.courseNature];

              course.versionId = course.bcDetails[0].versionId;
              course.versionName = course.bcDetails[0].versionName;
              courses.push(course);
              let courseDict = {
                courseId: eachCourseId,
                // 'versionId':eachVersionId,
              };

              eachCourse.push(courseDict);
              CourseId.push(eachCourseId);
            });
          } else {
            that.hasCourse = false;
          }

          that.drawertableData = courses;
          that.origintableData = courses;
          that.programeCourseInfo = eachCourse;
          that.programInfoCourseId = CourseId;
          console.log("programeCourseInfo is ", that.programeCourseInfo);
          // that.origintableData = courses;
          that.drawerresult = res;
        })
        .catch((e) => {
          console.log("e", e);
          that.hasCourse = false;
        });
    },
    selectionOption1(val) {
      console.log(val, typeof val);

      if (val == "更新时间") {
        this.sortBy.option1 = val;
        this.drawertableData.sort(
          (a, b) => parseInt(a.courseId) - parseInt(b.courseId)
        );
      }
      if (val == "创建时间") {
        this.sortBy.option1 = val;
        this.drawertableData.sort(
          (a, b) => parseInt(b.courseId) - parseInt(a.courseId)
        );
      }
      if (val == "名称") {
        this.sortBy.option1 = val;
        this.drawertableData.sort(function (a, b) {
          return a.courseName.localeCompare(b.courseName);
        });
      }

      if (val == "") {
        this.sortBy.option1 = "更新时间";
        this.drawertableData.sort(
          (a, b) => parseInt(a.courseId) - parseInt(b.courseId)
        );
      }
    },
    selectionOption2(val) {
      console.log(val, typeof val);
      let originData = this.origintableData;
      let courseList = [];
      if (val == "全部") {
        this.drawertableData = originData;
      }
      if (val == "已完成设置") {
        this.drawertableData.forEach(function (course) {
          if (course.status == "0") {
            courseList.push(course);
          }
        });
        console.log("courseList", courseList);
        this.drawertableData = courseList;
      }
      if (val == "未完成设置") {
      }
      if (val == "回收站") {
      }
      if (val == "") {
        this.drawertableData.sort(
          (a, b) => parseInt(a.courseId) - parseInt(b.courseId)
        );
      }
    },
  
    cancelClick() {
      this.drawer = false;
    },
    addBaseCourse() {
      this.dialogFormVisible = false;
      console.log(this.form);
      let that = this;
      let postData = this.formTopostData(this.form);
      console.log("postData:", postData);
      return request({
        url: "/baseCourse/add",
        method: "post",
        data: postData,
      })
        .then(function (res) {
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            that.clearForm();
            that.getBaseCourse(that.pageSize, that.pageNum);
          }
        })
        .catch((e) => {
          console.log("e", e);

          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1500,
          });
          that.clearForm();
          that.getBaseCourse(that.pageSize, that.pageNum);
        });
    },
    formTopostData(form) {
      let postData = {};
      postData.departmentId = this.departmentId;
      postData.schoolId = this.schoolId;
      postData.majorId = this.majorId;
      postData.courseName = form.courseName;
      postData.courseCode = form.courseCode;
      postData.courseType = form.courseType;
      postData.courseNature = form.courseNature;
      postData.credit = form.credit;
      postData.courseYear = form.courseYear;
      postData.remark = form.remark;

      return postData;
    },
    clearForm() {
      this.form.courseId = "";
      this.form.courseName = "";
      this.form.courseCode = "";
      this.form.courseType = "";
      this.form.courseNature = "";
      this.form.credit = "";
      this.form.courseYear = "";
      this.form.remark = "";
    },
    postDataToform(val) {
      this.preform.courseId = val.courseId;
      this.preform.courseName = val.courseName;
      this.preform.courseCode = val.courseCode;
      this.preform.courseType = val.courseType == "学科基础课" ? "0" : "1";
      this.preform.courseNature = val.courseNature == "专业任选" ? "0" : "1";
      this.preform.credit = val.credit;
      this.preform.courseYear = val.courseYear == "2022" ? "0" : "1";
      this.preform.remark = val.remark;
    },
    dataTransfrom(course) {
      course.courseName = course.courseName ? "" : course.courseName.trim();
      course.courseCode = course.courseCode ? "" : course.courseCode.trim();
      course.courseType = course.courseType == "0" ? "学科基础课" : "还未确定";
      course.courseNature =
        course.courseNature == "0" ? "专业任选" : "还未确定";
      course.credit = course.credit;
      course.courseYear = course.courseYear == "0" ? "2022" : "2023";
      course.remark = course.remark ? "" : course.remark.trim();

      return course;
    },
    // goAddBaseCourses(){
    //   this.$router.push({ path:'/courses'})
    // },
    deleteBaseCourse() {
      let that = this;
      ElMessageBox.confirm("是否确认将所选课程从培养方案中移除？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return request({
          url: "/baseCourse/program/remove",
          method: "delete",
          data: that.deleteProgrameInfo,
        })
          .then(function (res) {
            if (res == 204) {
              ElMessage({
                type: "success",
                message: `删除成功`,
                duration: 1500,
              });
              // that.clearForm();
              that.getProgramCourse();
              that.$refs.multipleTable.clearSelection();
              that.numSelected = 0;
              if (that.clickState == 1) {
                that.clickState = 0;
                that.closeShow = !that.closeShow;
              }
            }
          })
          .catch((e) => {
            console.log("e", e);
            ElMessage({
              type: "error",
              message: `删除失败`,
              duration: 1500,
            });
            // that.clearForm();
            // that.getProgramCourse();
          });
      });
    },
    //总步骤
    getProgrameInfo() {
      let that = this;
      this.getBaseCourseDictforProgram();
    },
    //组建向programe里添加课程信息的字典
    getBaseCourseDictforProgram() {
      var postData = [];
      let that = this;
      this.drawercourseId.forEach(function (courseId) {
        let courseBCDMId = "";
        let courseDetailId = "";
        if (!that.programInfoCourseId.includes(courseId)) {
          that
            .getDetail(courseId)
            .then(function (res) {
              if (res) {
                courseDetailId = res;
              } else {
                return console.log("detailId is null");
              }
            })
            .then(function () {
              var programCoursedict = {
                bcmdId: courseBCDMId,
                detailId: courseDetailId,
                programId: that.programId,
                courseId: courseId,
              };
              postData.push(programCoursedict);
            })
            .then(function () {
              that.programeInfo = postData;
              console.log("getBaseCourseDictforProgram:", that.programeInfo);
            });
        }
      });
    },
    getBCMId() {
      // console.log("!", this.programeInfo);
      // if (this.programeInfo.length > 0) {
        let that = this;
        this.programeInfo.forEach(function (courseInfo) {
          let courseBCDMId = "";
          console.log("getBCMId:", courseInfo.detailId);
          that
            .getBaseCourse(
              that.pageSize,
              that.pageNum,
              that.majorId,
              courseInfo.detailId
            )
            .then(function (res) {
              console.log("BCMId: ", res);
              if (res) {
                console.log("bcdmId is :", res);
                courseBCDMId = res;
                courseInfo.bcmdId = courseBCDMId;
              } else {
                console.log("bcdmId is null");
              }
            });
        });
        for (const element of this.versions) {
          if (element["versionId"] == that.currentVersionId) {
            console.log("find same ");
            that.currentVersion = element["label"];
            that.currentVersionName = element["label"];
          }
        }
        console.log("currentVersionName", this.currentVersionName);
        let message =
          "是否确认将所选课程（课程大纲版本：" +
          this.currentVersionName +
          "）添加到培养方案中 ？";
        ElMessageBox.confirm(message, "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(function () {
          that.addBaseCourseInProgram();
        });
      // }
    },
    //向programe添加课程
    addBaseCourseInProgram() {
      let that = this;
      return request({
        url: "/baseCourse/program/add",
        method: "post",
        data: this.programeInfo,
      })
        .then(function (res) {
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            that.drawercourseId = [];
            that.drawerCourseIndex = [];
            that.getProgramCourse();
            that.getBaseCourse(that.pageSize, that.pageNum);
            that.$refs.drawermultipleTable.clearSelection();

            if (that.drawerclickState == 1) {
              that.drawerclickState = 0;
              that.drawercloseShow = !that.drawercloseShow;
            }
          }
        })
        .catch((e) => {
          console.log("e", e);
          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1500,
          });
          that.drawercourseId = [];
          that.drawerCourseIndex = [];
          that.$refs.drawermultipleTable.clearSelection();
          if (that.drawerclickState == 1) {
            that.drawerclickState = 0;
            that.drawercloseShow = !that.drawercloseShow;
          }
        });
    },
    editTrigger(val) {
      console.log("选中的信息：", val.courseId);

      this.postDataToform(val);
      this.dialogFormVisible1 = true;
      // return request({
      //   url:'/baseCourse/edit',
      //   method:'post',

      // })
    },
    editBaseCourse() {
      this.dialogFormVisible1 = false;
      let that = this;
      console.log("preform:", this.preform);
      return request({
        url: "/baseCourse/edit",
        method: "post",
        data: this.preform,
      })
        .then(function (res) {
          console.log("res:", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1500,
            });

            that.getBaseCourse(that.pageSize, that.pageNum);
          }
        })
        .catch((e) => {
          console.log("e", e);

          ElMessage({
            type: "error",
            message: `更新失败`,
            duration: 1500,
          });
          that.getBaseCourse(that.pageSize, that.pageNum);
        });
    },
    handleSelectionChange(val) {
      let that = this;
      var courseId = [];
      var deleteCourseInfo = [];
      this.multipleSelection = val;
      console.log("选中的信息：", val);
      val.forEach(function (course) {
        let res = course.courseId;
        let courseDetailId = course.bcDetails[0].detailId;
        var eachCourseInfo = {
          courseId: res,
          programId: that.programId,
          detailId: courseDetailId,
        };
        deleteCourseInfo.push(eachCourseInfo);
        courseId.push(res);
      });
      this.numSelected = this.multipleSelection.length;
      if (this.clickState != 1) {
        this.closeShow = !this.closeShow;
        this.clickState = 1;
      }
      if (this.clickState == 1 && this.numSelected == 0) {
        this.clickState = 0;
        this.closeShow = !this.closeShow;
      }
      this.courseId = courseId;
      this.deleteProgrameInfo = deleteCourseInfo;
      console.log("courseId:", this.courseId);
      console.log("deleteProgrameInfo:", this.deleteProgrameInfo);
    },
    drawerchandleSelectionChange(val) {
      var courseId = [];
      var courseIndex = [];
      this.drawermultipleSelection = val;
      console.log("选中的信息：", val);
      val.forEach(function (course) {
        let res = course.courseId;
        let index = course.index;
        courseId.push(res);
        courseIndex.push(index);
      });
      this.drawernumSelected = this.drawermultipleSelection.length;

      if (this.drawerclickState != 1) {
        this.drawercloseShow = !this.drawercloseShow;
        this.drawerclickState = 1;
      }
      if (this.drawerclickState == 1 && this.drawernumSelected == 0) {
        this.drawerclickState = 0;
        this.drawercloseShow = !this.drawercloseShow;
      }
      this.drawercourseId = courseId;
      this.drawerCourseIndex = courseIndex;
      console.log(
        "courseId:",
        this.drawercourseId,
        "courseIndex:",
        this.drawerCourseIndex
      );
      this.getBaseCourseDictforProgram();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
        if (this.clickState == 1) {
          this.clickState = 0;
          this.closeShow = !this.closeShow;
        }
      }
    },
    drawertoggleSelection(rows) {
      if (rows) {
      } else {
        this.$refs.drawermultipleTable.clearSelection();
        if (this.drawerclickState == 1) {
          this.drawerclickState = 0;
          this.drawercloseShow = !this.drawercloseShow;
        }
      }
    },
    async getBaseCourse(pageSize, pageNum, majorId, detailId) {
      let that = this;
      let courses = [];
      let realurl = "";
      let courseBCDMId = "";
      let count = 0;
      this.loadmoreDisabled = true;
      this.programInfoCourseCount = 0;
      if (majorId) {
        realurl = "/detailProgram/list"; //通过majorId来显示已经添加的detail，可以获取到courseId
        return request({
          url: realurl + "?" + "majorId=" + this.majorId,
          method: "get",
        }).then(function (res) {
          that.loadmoreDisabled = false;
          if (res.rows) {
            res.rows.forEach(function (course) {
              if (course.detailId == detailId) {
                courseBCDMId = course.bcdmId;
              }
            });
          }

          return courseBCDMId;
        });
    }
    else{
      realurl = '/baseCourse/list';//根据获取到的已经添加过的courseId来排除搜索到的detail，两个限制vesionId和couseId
      
      return request({
            url:realurl,
            method:'get',
            params:{
            'pageSize':pageSize,
            'pageNum':pageNum,
            'departmentId':that.departmentId,
            'versionId':that.currentVersionId,
            'schoolId':that.schoolId,
            'selectKeyWord':that.keyword
            },
        }).then(function(res){
          that.loadmoreDisabled = false;
          console.log('courseDetails:',res);
          console.log('department:',that.departmentId,'schoolId:',that.schoolId,'majorId:',that.majorId,'currentVersionId',that.currentVersionId);
          console.log('已经选择的课：',that.programeCourseInfo);
          res.rows.forEach(function(course){
            course.courseName=course.courseName;
            course.courseCode=course.courseCode;
            course.courseType = that.courseTypeSource[course.courseType];
            course.courseNature = that.courseNatureSource[course.courseNature];
            
            course.remark = false;//用remark来判断是否选课
            
            course.trueversionId = course.versionId;
            if(course.bcDetails.length){
              for (const element of course.bcDetails) {
                  if (element.versionId == that.currentVersionId) {
                    course.versionId = true;
                    break;
                  } else {
                    course.versionId = false;
                  }
                }
              }
              if (course.respondentInfos) {
                // let teacherName =[];
                course.respondentInfos.forEach(function (respondent) {
                  course.respondentName = respondent.respondentName;
                  // teacherName.push(respondent.respondentName);
                });
                // course.respondentName = teacherName;
              }
              // course.versionId = (course.versionId == that.currentVersionVale) ? true : false;
              course.index = count;
              courses.push(course);
              count++;
            });

            if (that.hasProgram) {
              that.programeCourseInfo.forEach(function (courseInfo) {
                try {
                  courses.forEach(function (course) {
                    // console.log('courseId:',courseInfo.courseId,course.courseId,' versionId: ',courseInfo.versionId,course.trueversionId)
                    if (!course.remark) {
                      if (courseInfo.courseId == course.courseId) {
                        that.programInfoCourseCount =
                          that.programInfoCourseCount + 1;
                        course.remark = true;
                        throw new Error("remark");
                      } else {
                        course.remark = false;
                      }
                    }
                  });
                } catch (e) {
                  if (e.message != "remark") throw e;
                }
              });
            }

            that.tableData = courses;
            that.result = res;
            if (pageSize >= res.total) {
              that.showLoadmore = false;
            } else {
              that.showLoadmore = true;
            }
          })
          .then(function () {
            that.tableData.forEach(function (data) {
              if (data.remark) {
                console.log("course has selected!");
                that.$refs.drawermultipleTable.toggleRowSelection(
                  that.tableData[data.index],
                  true
                );
              } else {
              }
            });
          });
      }
    },
    checkCurrentProgram() {
      console.log("year has changed");
      checkProgram(this.majorId, this.$store.state.currentInfo.year)
        .then((res) => {
          console.log("res", res);
          if (res.msg == "操作成功" && res.code === "SUCCESS") {
            this.hasProgram = true;
            this.programId = res.data.programId;
            this.$store.commit("major/setProgramId", this.programId);
          }
          this.getProgramCourse();
        })
        .catch((e) => {
          console.log("e", e);
          if (e.code == "PROGRAM_NOT_FIND") {
            this.hasProgram = false;
          }
        });
    },
    async activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      this.majorId = this.$store.state.major.majorId;
      this.majorName = this.$store.state.major.majorName;
      this.programId = this.$store.state.major.programId;

      this.currentVersionId = this.$store.state.course.baseCourseVersionId;
      this.checkCurrentProgram();
      this.getDict();
      console.log(
        "schoolId+departmentId+majorId",
        this.schoolId,
        this.departmentId,
        this.majorId
      );
    },
  },
  mounted: function () {
    let that = this;
    this.checkProgram();

    if (this.hasProgram) {
      this.activate();
    }

    // this.getBaseCourse(this.pageSize,this.pageNum);

    // this.getBaseCourse(this.pageSize,this.pageNum,this.majorId);
  },
  computed: {
    yearChange() {
      return this.$store.state.currentInfo.year;
    },
  },
  watch: {
    yearChange: {
      deep: true,
      handler(value) {
        this.checkCurrentProgram();
      },
    },
  },
};
</script>

<style scoped>
.numSelectedCourse{
  display: flex;
  line-height:35px;
}
.rightSlot {
  position: absolute;
  right: 10%;
  width: 440px;
  margin-top: 10px;
}
.selecter {
  margin-left: 15px;
  width: 120px;
}
.dropdownstyle {
  float: right;
  margin-right: 70px;
}
.dropdownIcon {
  margin-top: 10px;
  cursor: pointer;
}
.loadmorestyle {
  padding-top: 24px;
}
.rowStyle {
  top: 10px;
}
:deep().el-input__wrapper {
  border-bottom: 1px solid #d5d5d5;
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  box-shadow: 0 0 0 0px;
  border-radius: 0;
  width: 100px;
}
.el-select:hover:not(.el-select--disabled) :deep().el-input__wrapper {
  box-shadow: 0 0 0 0px;
}



.row-style {
  padding-top: 5px;
}
.el-checkbox__input.is-disabled {
  background-color: #0e5cd0;
}
.el-table.tableColumn {
  --el-table-tr-bg-color: rgb(189, 189, 189);
}
.el-table__body {
  background-color: rgb(189, 189, 189);
}

#rightTime {
  color: #3f51b5;
}

.drawerBlock {
  position: relative;
  color: rgb(189, 189, 189);
}
.deleteButton {
  margin-right: 10%;
  margin-top: 0;
  margin-bottom: 0;
}
.searchIndrawer {
  position: relative;
  top: -12px;
  border-bottom: none;

  left: -50px;
}
.drawerdeleteButton {
  float: right;
  margin-left: 30px;
}
.drawersubmenu {
  color: #3f51b5;
  font-size: 14px;
  font-weight: 500;
  /* height: 44px; */
  /* min-height: 44px; */
  /* line-height: 3em; */
  margin-bottom: 13px;
  /* border-bottom: 1px solid #d0d0d0; */
  background-color: transparent;
}
.clearSelected {
  color: black;
  margin-top: 2px;
  line-height: 55px;
  float: right;
  align-items: center;
  text-align: center;
  border-radius: 2px;
  outline: none;
  border: 0;
  padding: 0 6px;
  background-color: #f2f2f2;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.clearSelected:hover {
  background-color: #c4c4c4;
}
.submenu {
  color: #3f51b5;
  font-size: 14px;
  font-weight: 500;
  height: 55px;
  position: absolute;
  top: 110px;
  left: 0px;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  background-color: #f2f2f2;
}
.md-padding {
  margin-top: 85px;
  display: flex;
  justify-content: center;
}

.searchBar {
  display: inline-block;
  width: 100%;
  border: 1px solid rgb(189, 189, 189);
}
.headerSearch {
  border: 0;
  float: left;
  width: 50%;
}
.selectionBar {
  display: flex;
  flex-direction: row;
}
.m-2 {
  left: 10%;
  float: left;
  top: 6px;
}
.m-3 {
  float: right;
  top: 6px;
  right: 10%;
}
.addCourseButton {
  background-color: rgb(33, 150, 243);
  min-height: 56px;
  min-width: 56px;
  float: right;
  top: -34px;
  right: 40px;
}
.el-table-container {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.addIcon {
  color: white;
  width: 24px;
  height: 24px;
  top: 3px;
}
.addCourseButton:hover {
  background-color: rgb(41, 98, 255);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
}
.no-program {
  display: flex;
  flex-direction: column;
}
/* drawer的头部宽度 */
:deep().el-drawer__header {
  margin-bottom: 0;
}
:deep().el-drawer__close-btn {
  margin-top: -60px;
}
</style>
