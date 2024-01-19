<template>
    <div v-show="hasProgram">
      <div v-show="hasCourse">
        
        <div style="width: auto;height: 55px;border-bottom: 1px solid rgb(189, 189, 189);display: flex;">
            <el-icon
                class="backIcon"
                size="24px"
                color="rgb(137, 137, 137)"
                @click="backCourse()">
                <Back />
            </el-icon>
            <el-divider class="divider" direction="vertical" />
        </div>
       
        
        
        <!-- <el-divider class="divider" direction="vertical" /> -->
        <HeaderSearch
          msg="搜索课程名称"
          v-show="!closeShow"
          @SearchValue="getSearchValueformProgram"
          class="SearchBar"
        >
          <template #rightTime>
            <div class="rightSlot">
              <div class="selectionBar">
                <el-select
                  v-model="chosenYear"
                  class="selecter"
                  placeholder="全部学年"
                  @change="getProgramCourse()"
                >
                  <el-option
                    v-for="item in academicYear"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                /></el-select>
                <el-select
                  v-model="chosenSemester"
                  placeholder="全部学期"
                  class="selecter"
                  @change="getProgramCourse()"
                >
                  <el-option
                v-for="item in semester"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
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
                已选中 {{ numSelected  }} 门课程
              </div>
            </el-col>
            <el-col :span="4">
              <el-dropdown class="dropdownstyle">
                <el-icon class="dropdownIcon"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="this.deleteBaseCourse()">
                      <el-icon><Delete /></el-icon>
                      &nbsp;删除支撑课程课程
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
        style="width: 1195px;"
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
      <el-table-column prop="className" label="课程名" width="190" />
      <el-table-column prop="allTeacherName" label="任课教师" width="150" />
      <el-table-column prop="courseCode" label="课程号" width="150">
      </el-table-column>
      <el-table-column prop="versionName" label="大纲版本" width="120" />
      <el-table-column prop="identifier" label="开课号" width="270" />
      <el-table-column prop="academicYear" label="学年" width="140" />
      <el-table-column prop="semester" label="学期" width="120" />
        </el-table>
     </div>
    </div>
  
        
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
        @close = 'closeDrawer'
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
              <el-table-column prop="className" label="课程名" width="180" />
              <el-table-column prop="allTeacherName" label="任课教师" width="150" />
              <el-table-column prop="courseCode" label="课程号" width="100" />
              <el-table-column label="大纲版本" width="150">
              <template #default="scope">
                  <el-tag v-show="scope.row.versionId">
                      {{ scope.row.versionName }}
                  </el-tag>
                <el-tooltip content="关联课程大纲">
                  <el-tag
                    v-show="!scope.row.versionId"
                    type="danger"
                    @click.stop="connectBasecourseDetail(scope.row)">
                    未关联课程大纲
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
          <el-button type="primary" @click="confirmAssign()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
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
  import {
  getClass,
} from "@/api/class";
  import request from "@/utils/request/request";
  import { getDictionary } from "@/api/dictionary";
  import { checkProgram } from "@/api/program";
  import { getDetails,assign } from "@/api/basecourse";
  
  export default {
    name: "courseDetail",
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
        supportingId:[],
        detailList:[],
        assignedDetail: "",
        currentConnectingClass:[],
        isAssign:false,
        currentInfo: {
        departmentId: Number,
        schoolId: Number,
      },
        //选择的学年和学期
        chosenYear: "",
        chosenSemester: "",
        academicYear:'',
        semester:'',
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

        //支撑课程
        supportingClass:[],

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
        drawertableData: [],
        origintableData: [],
  
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
        tableData: [],
  
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
      closeDrawer(){
        console.log('close drawer!');
        this.drawercourseId=[];
        this.drawerCourseIndex=[];
        this.supportingClass=[];
        this.$refs.drawermultipleTable.clearSelection();
      },
      //获取detailId列表
    getDetailList() {
      getDetails(
        this.currentConnectingClass.courseId,
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
      backCourse(){
        this.$router.push('/courses')
      },
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
        this.academicYear = res.academic_year;
        this.semester = res.semester;
        //头部栏筛选使用
        let year = {};
        year.dictLabel = "全部学年";
        year.dictValue = null;
        this.academicYear.unshift(year);
        let semester = {};
        semester.dictLabel = "全部学期";
        semester.dictValue = null;
        this.semester.unshift(semester);

        
  
          // that.courseTypeSource = res.
        }).then(()=>{
          this.checkCurrentProgram();
        })
      },
      getSearchValue(data) {
        this.keyword = data;
        this.getBaseCourse();
      },
      getSearchValueforClass(data) {
        this.keyword = data;
        this.getBaseCourse();
      },
      rowKey(row) {
        return row.courseId;
      },
      //直接关联课程大纲
      connectBasecourseDetail(row) {
        console.log('connecting to bcd');
        this.currentConnectingClass = row;
        this.getDetailList();
        this.isAssign = true;
       
      },
      //确定分配课程大纲
      confirmAssign() {
      console.log('connecting info:',this.currentConnectingClass);
      let currentDetail = {};
      this.detailList.forEach((detail)=>{
        if(this.assignedDetail == detail.detailId){
          currentDetail = detail;
        }
      });
      let currentConnectingClassDict = [{
      "classId": this.currentConnectingClass.classId,
      "detailId": this.assignedDetail,
      "versionId": currentDetail.versionId,
      "versionName": currentDetail.versionName,
      }];
      assign(currentConnectingClassDict).then((res) => {
        // console.log("assign",res);
        if (res.code === "SUCCESS") {
          this.isAssign = false;
          ElMessage({
            type: "success",
            message: "分配成功",
            duration: 1500,
          });
          this.currentConnectingClass = [];
          this.getBaseCourse();
          
        } else {
          ElMessage({
            type: "error",
            message: "分配失败",
            duration: 1500,
          });
        }
      });
    },
      //加载更多的课
      loadmoreCourse() {
        this.$refs.drawermultipleTable.clearSelection();
        if (this.result.total - this.pageSize >= 20) {
          this.pageSize += 20;
          this.getBaseCourse();
        } else {
          this.pageSize += this.result.total - this.pageSize;
          this.getBaseCourse();
        }
      },
      //跳转到详细页面
      goBaseCourseDetail(row, column) {
        console.log('row',row);
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
  
        this.getBaseCourse();
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
        this.getBaseCourse();
      },
      //获取支撑课程
    async getProgramCourse() {
        let that = this;
        this.drawertableData = [];
        this.origintableData = [];
        console.log('getting supporting class');
        return request({
          url: "/classes/supportingClass/list",
          method: "get",
          params: {
            schoolId: this.schoolId,
            departmentId: this.departmentId,
            bcdmId: this.$store.state.baseCourseDetailProgram.bcdmId,
            courseId: this.$store.state.baseCourseDetailProgram.classId,
            academicYear:this.chosenYear,
            semester:this.chosenSemester,
            selectKeyWord: this.keywordforProgrameCourse,
          },
        })
          .then(function (res) {
            console.log("getClassList", res);
          if (res.code === "SUCCESS") {
            that.drawertableData = res.rows;
            if (that.drawertableData.length == 0) {
              that.noClass = true;
              that.hasClass = false;
            } else {
              that.hasClass = true;
              that.noClass = false;
            }
            that.total = res.total;
            if (that.pageSize >= res.total) {
              that.showLoadmore = false;
            } else {
              that.showLoadmore = true;
            }
            if (that.drawertableData.length > 0) {
              that.programInfoCourseCount = that.drawertableData.length;
              for (let i = 0; i < that.drawertableData.length; i++) {
                that.drawertableData[i].allTeacherName =
                that.drawertableData[i].teacherName;
                if (that.drawertableData[i].additionalTeacherList !== null) {
                  that.drawertableData[i].additionalTeacherList.forEach(
                    (teacher) => {
                      that.drawertableData[i].allTeacherName =
                      that.drawertableData[i].allTeacherName +
                        "," +
                        teacher.teacherName;
                    }
                  );
                }
                that.drawertableData[i].teachers = [];
                let temp =
                that.drawertableData[i].teacherName +
                  "(" +
                  that.drawertableData[i].teacherNumber +
                  ")";
                  that.drawertableData[i].teachers.push(temp);
                if (that.drawertableData[i].additionalTeacherList !== null) {
                  that.drawertableData[i].additionalTeacherList.forEach(
                    (teacher) => {
                      let temp =
                        teacher.teacherName + "(" + teacher.teacherNumber + ")";
                        that.drawertableData[i].teachers.push(temp);
                    }
                  );
                }
                that.academicYear.forEach((year) => {
                  if (year.dictValue == that.drawertableData[i].academicYear) {
                    that.drawertableData[i].academicYear = year.dictLabel;
                  }
                });
                that.semester.forEach((semester) => {
                  if (semester.dictValue == that.drawertableData[i].semester) {
                    that.drawertableData[i].semester = semester.dictLabel;
                  }
                });
              }
            }
            // console.log("#", this.classTable);
          }
          })
          .catch((e) => {
            console.log("e", e);
            that.hasCourse = false;
          });
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
     
      //删除支撑课程
      deleteBaseCourse() {
        let that = this;
        ElMessageBox.confirm("是否确认将所选支撑课程从课程体系中移除？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          return request({
            url: "/classes/supportingClass/remove",
            method: "delete",
            data: that.supportingId,
          })
            .then(function (res) {
              console.log('res',res);
              if (res.code == 'SUCCESS') {
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
      getBCMId() {
      
          let that = this;
          
          
          console.log("currentVersionName", this.currentVersionName);
          let message =
            "是否确认将所选教学班添加到支撑课程中 ？";
          ElMessageBox.confirm(message, "", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(function () {
            that.addBaseCourseInProgram();
          });
      
      },
      //向课程体系添加支撑课程
      addBaseCourseInProgram() {
        let that = this;
        let tempList = []
        
        for(let i=this.programInfoCourseCount;i<this.supportingClass.length;i++){
          tempList.push(this.supportingClass[i])
        }
        console.log('supporting class add info',tempList);
        return request({
          url: "/classes/supportingClass/add",
          method: "post",
          data: tempList,
        })
          .then(function (res) {
            if (res.code == "SUCCESS") {
              ElMessage({
                type: "success",
                message: `新建成功`,
                duration: 1500,
              });
              that.supportingClass = [];
              that.drawercourseId = [];
              that.drawerCourseIndex = [];
              that.getProgramCourse();
              that.getBaseCourse();
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
      
     
      handleSelectionChange(val) {
        let that = this;
        var courseId = [];
        let supportingId = [];
        var deleteCourseInfo = [];
        this.multipleSelection = val;
        console.log("选中的信息：", val);
        val.forEach(function (course) {
          
          var eachCourseInfo = {
            courseId: course.courseId,
            programId: that.programId,
            detailId: course.detailId,
            bcdmId:course.bcdmId,
          };
          deleteCourseInfo.push(eachCourseInfo);
          courseId.push(course.courseId);
          supportingId.push(course.supportingId);
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
        this.supportingId = supportingId;
        this.deleteProgrameInfo = deleteCourseInfo;
        console.log("supportingId:", this.supportingId);
        console.log("deleteProgrameInfo:", this.deleteProgrameInfo);
      },
      drawerchandleSelectionChange(val) {
        let that = this;
        let classId = [];
        let courseIndex = [];
        let tempList = [];
        this.drawermultipleSelection = val;
        console.log("选中的信息：", val);
        val.forEach(function (course) {
          classId.push(course.classId);
          courseIndex.push(course.index);
          let supportDict = {
            bcdmId:that.$store.state.baseCourseDetailProgram.bcdmId,
            classId:course.classId,
            className:course.className,
            courseCode:course.courseCode,
            courseId:course.courseId,
            schoolId:course.schoolId,
            teacherId:course.teacherId
          }
          tempList.push(supportDict);
        });
        this.drawernumSelected = this.drawermultipleSelection.length;
        this.supportingClass = tempList;
        if (this.drawerclickState != 1) {
          this.drawercloseShow = !this.drawercloseShow;
          this.drawerclickState = 1;
        }
        if (this.drawerclickState == 1 && this.drawernumSelected == 0) {
          this.drawerclickState = 0;
          this.drawercloseShow = !this.drawercloseShow;
        }
        this.drawercourseId = classId;
        this.drawerCourseIndex = courseIndex;


        console.log(
          "classId:",
          this.drawercourseId,
          "courseIndex:",
          this.drawerCourseIndex,
          "supporting class:",this.supportingClass
        );
        // this.getBaseCourseDictforProgram();
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
      async getBaseCourse() {
        let that = this;
        let courses = [];
        let count = 0 ;
        this.loadmoreDisabled = true;
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
          this.loadmoreDisabled = false;
          if (res.code === "SUCCESS") {
            // this.tableData = res.rows;
            this.result = res;
            
              res.rows.forEach((course)=>{
                course.index = count;
                course.allTeacherName =
                course.teacherName;
                if (course.additionalTeacherList !== null) {
                  course.additionalTeacherList.forEach(
                    (teacher) => {
                      course.allTeacherName =
                      course.allTeacherName +
                        "," +
                        teacher.teacherName;
                    }
                  );
                }
                course.teachers = [];
                let temp =
                course.teacherName +
                  "(" +
                  course.teacherNumber +
                  ")";
                  course.teachers.push(temp);
                if (course.additionalTeacherList !== null) {
                  course.additionalTeacherList.forEach(
                    (teacher) => {
                      let temp =
                        teacher.teacherName + "(" + teacher.teacherNumber + ")";
                        course.teachers.push(temp);
                    }
                  );
                }
                this.academicYear.forEach((year) => {
                  if (year.dictValue == course.academicYear) {
                    course.academicYear = year.dictLabel;
                  }
                });
                this.semester.forEach((semester) => {
                  if (semester.dictValue == course.semester) {
                    course.semester = semester.dictLabel;
                  }
                });
                courses.push(course);
                count++;
              });
            
            that.drawertableData.forEach(function (courseInfo) {
                try {
                  courses.forEach(function (course) {
                    // console.log('courseId:',courseInfo.courseId,course.courseId,' versionId: ',courseInfo.versionId,course.trueversionId)
                    if (!course.remark) {
                      if (courseInfo.classId == course.classId) {
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
              this.tableData = courses;
              this.total = res.total;
          if (this.tableData.length == 0) {
              this.noClass = true;
              this.hasClass = false;
            } else {
              this.hasClass = true;
              this.noClass = false;
            }
            if (this.pageSize >= res.total) {
              this.showLoadmore = false;
            } else {
              this.showLoadmore = true;
            }
            console.log("#", this.tableData);

          }
        }).then(()=>{
          that.tableData.forEach(function (data) {
              if (data.remark) {
                that.$refs.drawermultipleTable.toggleRowSelection(
                  that.tableData[data.index],
                  true
                );
              } else {
              }
            });
        })
      
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
      sessionStorage.setItem("courseSearchFlag", true);

      let that = this;
      this.checkProgram();
  
      if (this.hasProgram) {
        this.activate();
        this.currentInfo.departmentId = this.$store.state.currentInfo.departmentId;
        this.currentInfo.schoolId = this.$store.state.currentInfo.schoolId;
        this.keyword = this.$store.state.baseCourseDetailProgram.courseCode;
      }
  
      // this.getBaseCourse(this.pageSize,this.pageNum);
  
      // this.getBaseCourse(this.pageSize,this.pageNum,this.majorId);
    },
    computed: {
      yearChange() {
        return this.$store.state.currentInfo.year;
      },
      currentChange() {
      return this.$store.state.currentInfo;
    },
    multipleSelectionChange() {
      return this.currentConnectingClass;
    },
    },
    watch: {
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
    currentChange: {
      deep: true,
      handler(value) {
        this.currentInfo.departmentId =
          this.$store.state.currentInfo.departmentId;
        this.identity = this.$store.state.currentInfo.identity;
        this.getClassList();
      },
    },
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
  .SearchBar{
    margin-left: 60px;
  }
  .backIcon{
    display: flex;
    cursor: pointer;
    justify-content: center;
    margin-left: 40px;
    top: 18px;
    line-height:56px;
  }
  .divider {
  display: flex;
  margin-left: 20px;
  top: 18px;
  height: 24px;
}
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

  :deep() .el-icon {
  height: 18px;
  width: 18px;
}
:deep() .el-icon svg {
  height: 18px;
  width: 18px;
} 
  :deep().searchBlock .el-icon {
    height: 20px;
    width: 20px;
  }
  :deep().searchBlock .el-icon svg {
    height: 20px;
    width: 20px;
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
  