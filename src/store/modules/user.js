// import { getToken, setToken, removeToken } from "@/utils/request/auth";

// const user = {
//   state: {
//     token: getToken(),
//     name: "",
//     avatar: "",
//     roles: [],
//     permissions: [],
//   },

//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token;
//     },
//     SET_NAME: (state, name) => {
//       state.name = name;
//     },
//     SET_AVATAR: (state, avatar) => {
//       state.avatar = avatar;
//     },
//     SET_ROLES: (state, roles) => {
//       state.roles = roles;
//     },
//     SET_PERMISSIONS: (state, permissions) => {
//       state.permissions = permissions;
//     },
//   },

//   actions: {
//     // 退出系统
//     LogOut({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         logout(state.token)re
//           .then(() => {
//             commit("SET_TOKEN", "");
//             commit("SET_ROLES", []);
//             commit("SET_PERMISSIONS", []);
//             removeToken();
//             resolve();
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       });
//     },
//   },
// };

// export default user;
