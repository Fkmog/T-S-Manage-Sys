<template>
  <!-- 顶部导航栏 -->
  <div class="block">
    <el-row class="block-row">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="返回"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          style="margin-left: 50px"
          @click="backBaseCourseDetail()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div class="title">{{ course.name }}</div>
    </el-row>
  </div>
  <div class="body">
    <el-tabs class="major-tab">
      <el-tab-pane
        v-model="chosenMajor"
        v-for="m in majorList"
        :key="m.majorId"
        :label="m.majorName"
      >
        <div class="card">
          <span style="color: grey; font-size: 14px; margin-top: 20px"
            >毕业要求指标点</span
          >

          <div class="attribute-detail" v-for="i in m.indicators" :key="i.id">
            <div class="detail-num">
              {{ i.serialNum }}
            </div>
            <div class="detail-content">
              <div class="name">{{ i.name }}</div>
              <div class="desc">{{ i.description }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Back } from "@element-plus/icons-vue";
import { getIndicators, getMajors } from "@/api/basecourse";
import { getMajorInfo } from "@/api/major";

export default {
  name: "baseCourseIndicators",
  components: {
    Back,
  },
  data() {
    return {
      chosenMajor: "",
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      majorList: [],
      programId: Number,
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.course.departmentId = this.$store.state.currentInfo.departmentId;
    this.course.schoolId = this.$store.state.currentInfo.schoolId;
    this.programId = this.$store.state.major.programId;
    console.log(this.course.name, this.course.detailId);
    this.checkMajors();
  },
  methods: {
    backBaseCourseDetail() {
      this.$router.push("/baseCourseDetail");
    },
    //查询对应的专业以及bcdmId
    checkMajors() {
      getMajors(this.course.detailId).then((res) => {
        console.log("checkMajors:", res);
        this.majorList = res.rows;
        for (let i = 0; i < this.majorList.length; i++) {
          getMajorInfo(this.majorList[i].majorId).then((res) => {
            this.majorList[i].majorName = res.data.majorName;
            console.log("this.majorList:", i, this.majorList[i]);
          });
        }
        this.checkIndicators();
      });
    },
    //查询各专业对应的Indicators指标点
    checkIndicators() {
      this.chosenMajor = this.majorList[0].majorName;
      console.log("!", this.majorList[0].majorName, this.chosenMajor);

      for (let i = 0; i < this.majorList.length; i++) {
        getIndicators(
          this.majorList[i].bcdmId,
          this.course.departmentId,
          this.course.schoolId,
          this.programId
        ).then((res) => {
          console.log("getIndicators:", i, res);
          this.majorList[i].indicators = res.data;
          //处理id->serialNum
          for(let j = 0;j<this.majorList[i].indicators.length;j++){
          let serialNum= []
          if (this.majorList[i].indicators[j].id.charAt(0) == 0) {
            serialNum[0] = this.majorList[i].indicators[j].id.charAt(1);
          }else{
            serialNum[0] = this.majorList[i].indicators[j].id.substring(0,2);
          }
           if (this.majorList[i].indicators[j].id.charAt(2) == 0) {
            serialNum[1] = this.majorList[i].indicators[j].id.charAt(3);
          }else{
            serialNum[1] = this.majorList[i].indicators[j].id.substring(2,4);
          }
          this.majorList[i].indicators[j].serialNum = serialNum.join(".")
          console.log("@@@", this.majorList[i].indicators[j].serialNum);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  cursor: pointer;
}
.block-row {
  margin-top: 18px;
}
.title {
  margin-left: 20px;
  font-size: 16px;
}
.divider {
  margin-left: 20px;
  height: 24px;
}
.body {
  display: flex;
  justify-content: center;
}
.major-tab {
  margin-top: 100px;
}
.card {
  display: flex;
  flex-direction: column;
  width: 750px;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
  padding: 0 0 20px 20px;
}
.el-tabs__content {
  overflow: visible;
}
.detail-num {
  color: #5c6bc0;
  font-weight: bold;
  margin-left: 25px;
  margin-top: 20px;
  font-size: 24px;
}
.name {
  font-size: 22px;
  font-weight: bold;
  margin: 20px;
  white-space: nowrap;
  margin-left: 30px;
}
.desc {
  margin: 20px;
  margin-left: 30px;
  margin-top:25px
}
.attribute-detail {
  display: flex;
  flex-direction: row;
  margin-top:20px
}
</style>