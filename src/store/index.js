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
        userName:'',
        userId:Number,
        roleInfo:[],
      },
      getters: {},
      mutations: {
        setUserName(state, newVal) {
          state.userName = newVal
        },
        setUserId(state, newVal) {
          state.userId = newVal
        },
        setRoleInfo(state,newVal){
          state.roleInfo = newVal
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
    }
  }
})
