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
        majorId: ''
      },
      getters: {},
      mutations: {
        setMajorName(state, newVal) {
          state.majorName = newVal
        },
        setMajorId(state, newVal) {
          state.majorId = newVal
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
        schoolId: ""
      },
      getters: {},
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

        }
      },
      actions: {},
      modules: {}
    },
    program: {
      namespaced: true,
      state: {
       year:Number,
      },
      getters: {},
      mutations: {
        setYear(state, newVal) {
          state.year = newVal

        }
      },
      actions: {},
      modules: {}
    }
  }
})
