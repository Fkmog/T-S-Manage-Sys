<template>
  <HeaderSearch
    msg="搜索课程名称、任课教师(姓名、工号)、课程号、开课号"
    @SearchValue="getSearchValue"
    :value="keyword"
  >
    <template #rightTime>
      <div class="rightSlot" v-show="!showAdd">
        <div class="selects">
          <el-select
            v-model="chosenYear"
            placeholder="全部学年"
            class="selecter"
            @change="getClassesList()"
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
            @change="getClassesList()"
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
            @change="getClassesList()"
          >
            <el-option
              v-for="item in classStatus"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
    </template>
  </HeaderSearch>
  <div class="classes-list">
    <div
      class="card"
      v-for="Class in classesList"
      :key="Class.classId"
      @click="toClass(Class)"
    >
      <div class="cardPic">
        <img src="@/assets/bgimg.png" />
        <div class="cardMask">
          <button class="cardMaskBtn">进入课程</button>
        </div>
      </div>
      <div class="cardText">
        <h3>{{ Class.className }}</h3>
        <span>{{ Class.identifier }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, DeleteFilled, Tools } from "@element-plus/icons-vue";
import { checkClasses } from "@/api/teacherSide";
import { getDictionary } from "@/api/dictionary";

export default {
  name: "TeacherClasses",
  components: {
    Search,
    DeleteFilled,
    Tools,
    HeaderSearch,
  },
  data() {
    return {
      classesList: {},
      keyword: "",
      chosenYear: "",
      chosenSemester: "",
      chosenStatus: "",
      academicYear: [],
      semester: [],
      classStatus: [],
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
    };
  },
  mounted() {
    this.getDictionary();
    if (sessionStorage.getItem("classTeacherSearchFlag")) {
      this.keyword = sessionStorage.getItem("teacherSearchForm");
      this.getSearchValue(this.keyword);
    } else {
      sessionStorage.removeItem("teacherSearchForm");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (from.path === "/teacherClasses" && to.path !== "/teacherClass") {
      sessionStorage.removeItem("teacherChosenYear");
      sessionStorage.removeItem("teacherChosenSemester");
      sessionStorage.removeItem("teacherChosenStatus");
    }
    next();
  },
  methods: {
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.academicYear = res.academic_year;
        this.semester = res.semester;
        this.classStatus = res.class_status;
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
        let status = {
          dictLabel: "全部",
          dictValue: null,
        };
        this.classStatus.unshift(status);
        // 下拉筛选状态保持
        let savedYear = sessionStorage.getItem("teacherChosenYear");
        let savedSemester = sessionStorage.getItem("teacherChosenSemester");
        let savedStatus = sessionStorage.getItem("teacherChosenStatus");
        if (savedYear || savedSemester || savedStatus) {
          {
            if (savedYear === "null") {
              this.chosenYear = null;
            } else {
              this.chosenYear = savedYear;
            }
            if (savedSemester === "null") {
              this.chosenSemester = null;
            } else {
              this.chosenSemester = savedSemester;
            }
            if (savedStatus === "null") {
              this.chosenStatus = null;
            } else {
              this.chosenStatus = savedStatus;
            }
          }
        }
        this.getClassesList();
      });
    },
    //获取课程列表
    getClassesList() {
      checkClasses(
        this.$store.state.currentInfo.schoolId,
        this.$store.state.currentInfo.departmentId,
        this.keyword,
        this.chosenYear,
        this.chosenSemester,
        this.chosenStatus
      ).then((res) => {
        this.classesList = res.rows;
        console.log("getClassesList", this.classesList);
      });
    },
    //跳转班级视图
    toClass(Class) {
      this.$store.commit("currentInfo/setTeacherSideClassInfo", Class);
      this.$store.commit("currentInfo/setOpenDrawer", false);
      sessionStorage.setItem("teacherSearchForm", this.keyword);
      sessionStorage.removeItem("classTeacherSearchFlag");
      if (
        this.chosenYear !== "" ||
        this.chosenSemester !== "" ||
        this.chosenStatus !== ""
      ) {
        sessionStorage.setItem("teacherChosenYear", this.chosenYear);
        sessionStorage.setItem("teacherChosenSemester", this.chosenSemester);
        sessionStorage.setItem("teacherChosenStatus", this.chosenStatus);
      }
      this.$router.push({ name: "TeacherClass" });
    },
    // 搜索栏查询
    getSearchValue(data) {
      this.keyword = data;
      sessionStorage.removeItem("classTeacherSearchFlag");
      console.log("keyword", this.keyword);
      this.getClassesList();
    },
  },
};
</script>

<style scoped>
.rightSlot {
  position: absolute;
  right: 10%;
  width: 440px;
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
/* 盒子群样式 */
.classes-list {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  margin-top: 55px;
  margin-bottom: 45px;
}
/* 卡片盒子顶层icon */
.deleteIcon {
  color: rgb(206, 203, 203);
  z-index: 100;
  opacity: 0;
  position: relative;
  left: 320px;
  top: 10px;
  pointer-events: auto;
}
.card:hover .deleteIcon {
  opacity: 1;
}
.deleteIcon:hover {
  color: white;
}
.toolsIcon {
  color: rgb(206, 203, 203);
  z-index: 100;
  opacity: 0;
  position: relative;
  left: 275px;
  top: 10px;
}
.card:hover .toolsIcon {
  opacity: 1;
}
.toolsIcon:hover {
  color: white;
}
/* 定义底层盒子样式 */
.card {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 35px;
  margin-top: 20px;
  position: relative;
  width: 350px;
  height: 250px;
  border-radius: 3px;
  box-shadow: 1px 3px 3px rgb(164, 163, 163);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  pointer-events: auto;
}

/* 图片样式*/
.cardPic {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px;
  overflow: hidden;
  transition: 0.3s;
  display: block;
}
/* 遮罩层 */
.cardMask {
  position: absolute;
  background: rgba(39, 39, 39, 0.6);
  color: white;
  opacity: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.card:hover .cardPic .cardMask {
  opacity: 1;
  transition: all 0.3s;
}

/* 按钮样式 */
.cardMaskBtn {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid white;
  height: 45px;
  width: 130px;
  font-size: 14px;
  color: white;
}
.card:hover .cardPic .cardMask .cardMaskBtn {
  display: block;
  margin: auto;
  margin-top: 60px;
  font-weight: bold;
}

.cardPic img {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}
.card:hover .cardPic img {
  transform: scale(1.2);
}
.card:hover .cardPic {
  height: 150px;
  transition: all 0.3s;
}
/* 文本展开效果*/
.cardText {
  position: absolute;
  bottom: -10px;
  width: 100%;
  height: 80px;
  transition: 0.3s;
  left: 0;
}
.card:hover .cardText {
  bottom: 20px;
}
.card:hover .cardText h3 {
  margin-top: 20px;
  transition: 0.3s;
}
/* 文字样式 */
.cardText h3 {
  text-align: center;
  margin-top: 20px;
  transition: 0.3s;
}
.card:hover .cardText span {
  display: block;
  margin-top: -5px;
  text-align: center;
  transition: 0.1s;
  opacity: 1;
  font-size: 14px;
  color: #828eae;
}
:deep().searchBlock .el-icon {
  height: 20px;
  width: 20px;
}
:deep().searchBlock .el-icon svg {
  height: 20px;
  width: 20px;
}
.cardText span {
  display: block;
  text-align: center;
  margin-top: 20px;
  transition: 0.1s;
  opacity: 0;
}
</style>
