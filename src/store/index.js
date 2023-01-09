import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userInfo: {
      namespaced: true,
      state: {
        userName: '',
        userId: Number,
        roleInfo: [],
        identity: [],
      },
      getters: {},
      mutations: {
        setUserName(state, newVal) {
          state.userName = newVal
        },
        setUserId(state, newVal) {
          state.userId = newVal
        },
        setRoleInfo(state, newVal) {
          state.roleInfo = newVal
        },
        setIdentity(state, newVal) {
          state.identity = newVal
        }
      },
      actions: {},
      modules: {}
    },
    major: {
      namespaced: true,
      state: {
        majorName: '',
        majorId: '',
        programId:''
      },
      getters: {},
      mutations: {
        setMajorName(state, newVal) {
          state.majorName = newVal
        },
        setMajorId(state, newVal) {
          state.majorId = newVal
        },
        setProgramId(state, newVal){
          state.programId = newVal
        }
      },
      actions: {},
      modules: {}
    },
    currentInfo: {
      namespaced: true,
      state: {
        departmentName: "",
        departmentId: "",
        schoolName: "",
        schoolId: "",
        year: '',
        role: {},
        isTeacher: false,
        // 教师端变量
        teacherSideClassInfo:{}
      },
      getters: {
        changeIsTeacher(state) {
          if (state.role.roleName == "教师") {
            state.isTeacher = true
          } else { state.isTeacher = false }
          return state.isTeacher
        }
      },
      mutations: {
        setDepartmentName(state, newVal) {
          state.departmentName = newVal
        },
        setDepartmentId(state, newVal) {
          state.departmentId = newVal
        },
        setSchoolName(state, newVal) {
          state.schoolName = newVal
        },
        setSchoolId(state, newVal) {
          state.schoolId = newVal
        },
        setYear(state, newVal) {
          state.year = newVal
        },
        setRole(state, newVal) {
          state.role = newVal
        },
        setTeacherSideClassInfo(state,newVal){
          state.teacherSideClassInfo = newVal
        }
      },
      actions: {},
      modules: {}
    },

  }
})
