<template>
  <HeaderSearch></HeaderSearch>
  <addBtn></addBtn>
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
import addBtn from "@/components/general/addBtn.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, DeleteFilled, Tools } from "@element-plus/icons-vue";
import { checkClasses } from "@/api/teacherSide";
export default {
  name: "TeacherClasses",
  components: {
    Search,
    DeleteFilled,
    Tools,
    HeaderSearch,
    addBtn,
  },
  data() {
    return {
      classesList: {},
    };
  },
  mounted() {
    this.getClassesList();
  },

  //   computed: {
  //     currentChange() {
  //       return this.$store.state.currentInfo;
  //     },
  //   },

  //   watch: {
  //     // 监视currentInfo
  //     currentChange: {
  //       deep: true,
  //       handler(value) {
  //         this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
  //         this.getMajorList(this.currentDepartmentId);
  //       },
  //     },
  //   },

  methods: {
    //获取课程列表
    getClassesList() {
      checkClasses(
        this.$store.state.currentInfo.schoolId,
        this.$store.state.currentInfo.departmentId
      ).then((res) => {
        this.classesList = res.rows;
        console.log("getClassesList", this.classesList);
      });
    },
    //跳转班级视图
    toClass(Class) {
      this.$store.commit("currentInfo/setTeacherSideClassInfo", Class);
      this.$router.push({ name: "TeacherClass" });
    },
    //     //增加专业
    //     addMajor() {
    //       ElMessageBox.prompt("专业名称：", "新建专业", {
    //         confirmButtonText: "确认",
    //         cancelButtonText: "取消",
    //         //校验规则
    //         inputPattern: /^.+$/,
    //         inputErrorMessage: "请输入新增专业名称",
    //       })
    //         .then(({ value }) => {
    //           let addMajorName = value;
    //           ElMessage({
    //             type: "success",
    //             message: `成功新建专业:${value}`,
    //             duration: 1000,
    //           });
    //           addMajor(addMajorName, this.currentDepartmentId).then((res) => {
    //             console.log("addMajor", res);
    //             this.getMajorList();
    //           });
    //         })
    //         .catch(() => {
    //           ElMessage({
    //             type: "info",
    //             message: "取消增加专业",
    //             duration: 1000,
    //           });
    //         });
    //     },
    //     //删除专业
    //     deleteMajor(majorId, majorName) {
    //       ElMessageBox.confirm("是否确定删除" + majorName + "专业？", "", {
    //         confirmButtonText: "确认",
    //         cancelButtonText: "取消",
    //         type: "warning",
    //       }).then(() => {
    //         deleteMajor(majorId)
    //           .then((res) => {
    //             console.log("deleteMajor", res);
    //             this.getMajorList(this.currentDepartmentId);
    //             ElMessage({
    //               type: "success",
    //               message: "删除成功",
    //               duration: 1000,
    //             });
    //           })
    //           .catch(() => {});
    //       });
    //     },
    //     //修改专业
    //     changeMajor(majorId) {
    //       ElMessageBox.prompt("新的专业名称：", "修改专业名称", {
    //         confirmButtonText: "确认",
    //         cancelButtonText: "取消",
    //         //校验规则
    //         inputPattern: /^.+$/,
    //         inputErrorMessage: "请输入修改后的专业名称",
    //       })
    //         .then(({ value }) => {
    //           let changeMajorName = value;
    //           ElMessage({
    //             type: "success",
    //             message: `成功修改专业名称:${value}`,
    //             duration: 1000,
    //           });
    //           changeMajor(changeMajorName, majorId, this.currentDepartmentId).then(
    //             (res) => {
    //               console.log("changeMajor", res);
    //               this.getMajorList();
    //             }
    //           );
    //         })
    //         .catch(() => {
    //           ElMessage({
    //             type: "info",
    //             message: "取消修改专业",
    //             duration: 1000,
    //           });
    //         });
    //     },
  },
};
</script>

<style scoped>
/* 盒子群样式 */
.classes-list {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin-left: 10%;
  flex-wrap: wrap;
  margin-top: 55px;
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
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 50px;
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
.cardText span {
  display: block;
  text-align: center;
  margin-top: 20px;
  transition: 0.1s;
  opacity: 0;
}
</style>