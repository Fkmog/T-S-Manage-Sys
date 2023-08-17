import { createStore } from "vuex";
import user from "./modules/user";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    userInfo: {
      namespaced: true,
      state: {
        userName: "",
        userId: Number,
        roleInfo: [],
        identity: [],
      },
      getters: {},
      mutations: {
        setUserName(state, newVal) {
          state.userName = newVal;
        },
        setUserId(state, newVal) {
          state.userId = newVal;
        },
        setRoleInfo(state, newVal) {
          state.roleInfo = newVal;
        },
        setIdentity(state, newVal) {
          state.identity = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    major: {
      namespaced: true,
      state: {
        majorName: "",
        majorId: "",
        programId: "",
      },
      getters: {},
      mutations: {
        setMajorName(state, newVal) {
          state.majorName = newVal;
        },
        setMajorId(state, newVal) {
          state.majorId = newVal;
        },
        setProgramId(state, newVal) {
          state.programId = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    currentInfo: {
      namespaced: true,
      state: {
        departmentName: "",
        departmentId: "",
        schoolName: "",
        schoolId: "",
        year: "",
        opendrawer:false,
        currentVersionValue:1,
        role: {},
        isTeacher: false,
        //当前角色身份
        identity: "",
        // 教师端变量
        teacherSideClassInfo: {},
        //管理员变量
        adminSideClassInfo: {},
        // 课程负责人变量
        respondClassInfo: {},
      },
      getters: {
        changeIsTeacher(state) {
          if (state.role.roleName == "教师") {
            state.identity = "教师";
          } else if (state.role.roleName == "学院管理员") {
            state.identity = "学院管理员";
          } else if (state.role.roleName == "课程负责人") {
            state.identity = "课程负责人";
          } else if (state.role.roleName == "web管理员") {
            state.identity = "web管理员";
          }
          return state.identity;
        },
      },
      mutations: {
        setDepartmentName(state, newVal) {
          state.departmentName = newVal;
        },
        setDepartmentId(state, newVal) {
          state.departmentId = newVal;
        },
        setSchoolName(state, newVal) {
          state.schoolName = newVal;
        },
        setSchoolId(state, newVal) {
          state.schoolId = newVal;
        },
        setYear(state, newVal) {
          state.year = newVal;
        },
        setOpenDrawer(state, newVal){
          state.opendrawer = newVal;
        },
        setRole(state, newVal) {
          state.role = newVal;
        },
        setIdentity(state, newVal) {
          state.identity = newVal;
        },
        setTeacherSideClassInfo(state, newVal) {
          state.teacherSideClassInfo = newVal;
        },
        setadminSideClassInfo(state, newVal) {
          state.adminSideClassInfo = newVal;
        },
        setRespondClassInfo(state, newVal) {
          state.respondClassInfo = newVal;
        },
        setCurrentVersionValue(state, newVal) {
          state.currentVersionValue = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    course: {
      namespaced: true,
      state: {
        courseName: "",
        courseId: "",
        detailId: Number,
        baseCourseVersionName: "",
        baseCourseVersionFlag: "",
        baseCourseVersionId: "",
        baseCourseCourseId: "",
        baseCourseCourseName: "",
        baseCourseCourseCode: "",
        baseCourseCourseType: "",
        baseCourseCourseNature: "",
        baseCourseCredit: "",
        baseCourseCourseYear: "",
        baseCourseRemark: "",
        baseCourseDetailId: "",
      },
      getters: {},
      mutations: {
        setbaseCourseDetailId(state, newVal) {
          state.baseCourseDetailId = newVal;
        },
        setCourseName(state, newVal) {
          state.courseName = newVal;
        },
        setCourseId(state, newVal) {
          state.courseId = newVal;
        },
        setDetailId(state, newVal) {
          state.detailId = newVal;
        },
        setbaseCourseVersionName(state, newVal) {
          state.baseCourseVersionName = newVal;
        },
        setbaseCourseVersionFlag(state, newVal) {
          state.baseCourseVersionFlag = newVal;
        },
        setbaseCourseVersionId(state, newVal) {
          state.baseCourseVersionId = newVal;
        },
        setbaseCourseCourseId(state, newVal) {
          state.baseCourseCourseId = newVal;
        },
        setbaseCourseCourseName(state, newVal) {
          state.baseCourseCourseName = newVal;
        },
        setbaseCourseCourseCode(state, newVal) {
          state.baseCourseCourseCode = newVal;
        },
        setbaseCourseCourseType(state, newVal) {
          state.baseCourseCourseType = newVal;
        },
        setbaseCourseCourseNature(state, newVal) {
          state.baseCourseCourseNature = newVal;
        },
        setbaseCourseCredit(state, newVal) {
          state.baseCourseCredit = newVal;
        },
        setbaseCourseCourseYear(state, newVal) {
          state.baseCourseCourseYear = newVal;
        },
        setbaseCourseRemark(state, newVal) {
          state.baseCourseRemark = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    baseCourseDetailProgram: {
      namespaced: true,
      state: {
        majorNum: "0",
        majorProgramId: Number,
      },
      getters: {},
      mutations: {
        setmajorNum(state, newVal) {
          state.majorNum = newVal;
        },
        setmajorProgramId(state, newVal) {
          state.majorProgramId = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    navInfo: {
      namespaced: true,
      state: {
        activeDisplay1: 0,
        activeDisplay2: 0,
        activeDisplay3: 0,
        activeDisplay4: 0,
      },
      getters: {},
      mutations: {
        setActiveDisplay1(state, newVal) {
          state.activeDisplay1 = newVal;
        },
        setActiveDisplay2(state, newVal) {
          state.activeDisplay2 = newVal;
        },
        setActiveDisplay3(state, newVal) {
          state.activeDisplay3 = newVal;
        },
        setActiveDisplay4(state, newVal) {
          state.activeDisplay4 = newVal;
        },
      },
      actions: {},
      modules: {},
    },
    user,
    reviewInfo:{
      namespaced: true,
      state:{
        message:'',
        checkState:''
      },
      getters: {},
      mutations: {
        setmessage(state, newVal) {
          state.message = newVal;
        },
        setcheckState(state, newVal) {
          state.checkState = newVal;
        },
      },
      actions: {},
      modules: {},
    }
  },
});
