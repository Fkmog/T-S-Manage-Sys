<template>
  <HeaderSearch
    :msg="searchMsg"
    @SearchValue="getSearchValue"
    :value="keyword"
  ></HeaderSearch>
  <addBtn @click="addMajor()"></addBtn>
  <div class="cardList" v-show="hasMajor">
    <div
      class="card"
      v-for="major in majorList"
      :key="major.majorId"
      @click="toMajor(major)"
    >
      <el-tooltip
        class="box-item"
        effect="dark"
        content="删除"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="deleteIcon"
          size="18px"
          @click.stop="deleteMajor(major.majorId, major.majorName)"
        >
          <DeleteFilled />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="修改"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="toolsIcon"
          size="18px"
          @click.stop="changeMajor(major.majorId, major.majorName)"
        >
          <Tools />
        </el-icon>
      </el-tooltip>

      <div class="cardPic">
        <img src="@/assets/bgimg.png" />
        <div class="cardMask">
          <button class="cardMaskBtn">进入专业</button>
        </div>
      </div>
      <div class="cardText">
        <h3>{{ major.majorName }}</h3>
      </div>
    </div>
  </div>
  <div class="no-major" v-show="noMajor">没有专业</div>
  <div class="no-major-detail" v-show="noMajor">
    请先点击右上角圆形按钮添加专业
  </div>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, DeleteFilled, Tools } from "@element-plus/icons-vue";
import { getMajor, addMajor, deleteMajor, changeMajor } from "@/api/major";
export default {
  name: "Major",
  components: {
    Search,
    DeleteFilled,
    Tools,
    HeaderSearch,
    addBtn,
  },
  data() {
    return {
      searchMsg: "搜索专业名称",
      keyword: "",
      addMajorName: "",
      majorList: [],
      hasMajor: false,
      noMajor: false,
      currentDepartmentId: Number,
      currentSchoolId: Number,
    };
  },
  mounted() {
    this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
    this.currentSchoolId = this.$store.state.currentInfo.schoolId;
    //获取专业列表
    this.getMajorList();
  },

  computed: {
    currentChange() {
      return this.$store.state.currentInfo;
    },
  },

  watch: {
    // 监视currentInfo
    currentChange: {
      deep: true,
      handler(value) {
        this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
        this.getMajorList(this.currentDepartmentId);
      },
    },
  },

  methods: {
    getSearchValue(data) {
      getMajor(this.currentDepartmentId, this.currentSchoolId, data).then(
        (res) => {
          this.majorList = res.rows;
          console.log("majorList", res);
        }
      );
    },
    //获取专业列表
    getMajorList() {
      getMajor(this.currentDepartmentId, this.currentSchoolId).then((res) => {
        this.majorList = res.rows;
        console.log("majorList", res);
        if (this.majorList.length > 0) {
          this.hasMajor = true;
          this.noMajor = false;
        } else {
          this.noMajor = true;
          this.hasMajor = false;
        }
      });
    },
    //跳转专业视图
    toMajor(major) {
      this.$store.commit("major/setMajorName", major.majorName);
      this.$store.commit("major/setMajorId", major.majorId);
      this.$router.push({ name: "Goal" });
    },
    //增加专业
    addMajor() {
      ElMessageBox.prompt("专业名称：", "新建专业", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: "add-major-box",
        //校验规则
        inputPattern: /^.+$/,
        inputErrorMessage: "请输入新增专业名称",
      })
        .then(({ value }) => {
          let addMajorName = value;
          addMajor(
            addMajorName,
            this.currentDepartmentId,
            this.currentSchoolId
          ).then((res) => {
            console.log("addMajor", res);
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1500,
            });
            this.getMajorList();
          });
        })
        .catch(() => {});
    },
    //删除专业
    deleteMajor(majorId, majorName) {
      ElMessageBox.confirm("是否确认删除" + majorName + "专业？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteMajor(majorId)
          .then((res) => {
            console.log("deleteMajor", res);
            this.getMajorList();
            ElMessage({
              type: "success",
              message: "删除成功",
              duration: 1500,
            });
          })
          .catch(() => {});
      });
    },
    //修改专业
    changeMajor(majorId, majorName) {
      ElMessageBox.prompt("新的专业名称：", "修改专业名称", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValue: majorName,
        //校验规则
        inputPattern: /^.+$/,
        inputErrorMessage: "请输入修改后的专业名称",
      })
        .then(({ value }) => {
          let changeMajorName = value;

          changeMajor(changeMajorName, majorId, this.currentDepartmentId).then(
            (res) => {
              ElMessage({
                type: "success",
                message: `更新成功`,
                duration: 1500,
              });
              console.log("changeMajor", res);
              this.getMajorList();
            }
          );
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
/* 盒子群样式 */
.cardList {
  display: flex;
  flex-direction: row;
  width: 1200px;
  margin: 0 auto;
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
}
.card:hover .cardText {
  bottom: 20px;
}
.card:hover .cardText h3 {
  margin-top: 40px;
  transition: 0.3s;
}
/* 文字样式 */
.cardText h3 {
  text-align: center;
  margin-top: 20px;
  transition: 0.3s;
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
.no-major {
  padding-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
.no-major-detail {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 13px;
  color: #828d96;
}
</style>
