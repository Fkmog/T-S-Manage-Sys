<template>
  <div class="content">
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
        <div class="title">毕业要求指标点</div>
      </el-row>
    </div>
    <!-- <editBtn @click="goEdit()"></editBtn> -->
    <div class="body">
      <div v-show="!hasMajor" class="no-major">未加入任何培养方案</div>
      <div v-show="hasMajor">
        <el-tabs
          class="major-tab"
          style="width: 750px"
          @tab-change="tabChange()"
          v-model="chosenMajor"
        >
          <el-tab-pane
            v-for="(major, index1) in majorList"
            :key="major.majorId"
            :label="major.programVersion"
          >
            <div class="card">
              <el-row class="card-head" style="margin-top: 30px">
                <span style="color: grey; font-size: 14px">毕业要求指标点</span>
                <div v-show="hasIndicators[index1]">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="编辑"
                    placement="bottom"
                    :hide-after="0"
                  >
                    <el-icon
                      class="edit-pen"
                      style="margin-top: -15px"
                      @click="goEdit(index1)"
                      ><EditPen
                    /></el-icon>
                  </el-tooltip>
                </div>
              </el-row>
              <div v-show="!hasIndicators[index1]" class="noIndicator">
                <el-button style="color: #6573c0" text @click="goEdit(index1)"
                  >添加达成度评价方式
                </el-button>
              </div>
              <div
                class="attribute"
                v-for="indicator in major.indicators"
                :key="indicator.id"
              >
                <div class="attribute-detail">
                  <div class="detail-num">
                    {{ indicator.serialNum }}
                  </div>
                  <div class="detail-content">
                    <div class="name">{{ indicator.name }}</div>
                    <div class="desc">{{ indicator.description }}</div>
                  </div>
                </div>
                <!-- 支撑方式 -->
                <div style="margin-left: 90px">
                  <span style="color: grey; font-size: 14px">支撑方式</span>
                  <div class="methods">
                    <div
                      v-for="method in indicator.supportMethodVos"
                      :key="method.id"
                    >
                      <el-row class="method-detail">
                        <el-col :span="4" class="method-weight">
                          (&nbsp;{{ method.weight }}%&nbsp;)
                        </el-col>
                        <el-col :span="18" class="method-desc">
                          {{ method.description }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { Back, EditPen } from "@element-plus/icons-vue";
import {
  getIndicators,
  getMajorsProgram,
  getDetailMajor,
  getPullIndicator,
} from "@/api/basecourse";
import { getMajorInfo } from "@/api/major";
import editBtn from "@/components/general/editBtn.vue";

export default {
  name: "baseCourseIndicators",
  components: {
    Back,
    editBtn,
    EditPen,
  },
  data() {
    return {
      chosenMajor: "0",
      course: {
        name: "",
        detailId: Number,
        departmentId: Number,
        schoolId: Number,
      },
      majorList: [],
      programIdList: [],
      currentProgramId: "",
      hasIndicators: [],
      hasMajor: false,
    };
  },
  mounted() {
    this.course.name = this.$store.state.course.courseName;
    this.course.detailId = this.$store.state.course.detailId;
    this.course.departmentId = this.$store.state.currentInfo.departmentId;
    this.course.schoolId = this.$store.state.currentInfo.schoolId;
    // console.log("!", this.programId);

    console.log(this.course.name, this.course.detailId);
    this.checkMajors();
  },
  methods: {
    backBaseCourseDetail() {
      this.$router.push("/baseCourseDetail");
    },
    goEdit(index1) {
      // console.log("!",index1,typeof(index1));
      this.$store.commit(
        "baseCourseDetailProgram/setmajorNum",
        index1.toString()
      );
      this.$router.push("/baseCourseIndicatorsEdit");
    },
    //查询对应的专业以及bcdmId
    checkMajors() {
      getMajorsProgram(
        this.course.detailId,
        this.course.departmentId,
        this.course.schoolId
      ).then((res) => {
        console.log("!", res);
        this.majorList = res.data;
        if (this.majorList.length == 0) {
          this.hasMajor = false;
        } else {
          this.hasMajor = true;
        }
        console.log("this.majorList:", this.majorList);
        for (let i = 0; i < this.majorList.length; i++) {
          getMajorInfo(this.majorList[i].majorId).then((res) => {
            this.majorList[i].majorName = res.data.majorName;
            this.majorList[i].programVersion =
              this.majorList[i].majorName + "-" + this.majorList[i].enrollyear;
            console.log("!", typeof this.majorList[i].indicators);
            this.programIdList[i] = this.majorList[i].programId;
          });
        }
        this.checkIndicators();
      });
    },
    //查询各专业对应的Indicators指标点
    checkIndicators() {
      for (let i = 0; i < this.majorList.length; i++) {
        getIndicators(
          this.majorList[i].bcdmId,
          this.course.departmentId,
          this.course.schoolId,
          this.majorList[i].programId
        ).then((res) => {
          console.log("getIndicators:", i, res);
          this.majorList[i].indicators = res.data;

          //处理id->serialNum
          for (let j = 0; j < this.majorList[i].indicators.length; j++) {
            let serialNum = [];
            if (this.majorList[i].indicators[j].id.charAt(0) == 0) {
              serialNum[0] = this.majorList[i].indicators[j].id.charAt(1);
            } else {
              serialNum[0] = this.majorList[i].indicators[j].id.substring(0, 2);
            }
            if (this.majorList[i].indicators[j].id.charAt(2) == 0) {
              serialNum[1] = this.majorList[i].indicators[j].id.charAt(3);
            } else {
              serialNum[1] = this.majorList[i].indicators[j].id.substring(2, 4);
            }
            this.majorList[i].indicators[j].serialNum = serialNum.join(".");
          }
          this.currentProgramId = this.programIdList[this.chosenMajor];
          this.checkPullIndicators(i);
        });
      }
    },
    //查询新增指标点列表
    checkPullIndicators(i) {
      getPullIndicator(this.currentProgramId).then((res) => {
        console.log("getPullIndicator", res);
        if (
          this.majorList[i].indicators === null ||
          this.majorList[i].indicators.length == 0
        ) {
          this.hasIndicators[i] = false;
        } else {
          this.hasIndicators[i] = true;
        }
      });
    },
    //切换tab
    tabChange() {
      // console.log("major",this.chosenMajor);
      if (this.majorList[this.chosenMajor].indicators.length == 0) {
        this.hasIndicators[this.chosenMajor] = false;
      } else {
        this.hasIndicators[this.chosenMajor] = true;
      }
      this.currentProgramId = this.programIdList[this.chosenMajor];
      this.checkPullIndicators(this.chosenMajor);
    },
  },
};
</script>

<style scoped>
/* .content {
  height: 100vh;
  background-color: #f2f2f2;
} */
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
.no-major {
  margin-top: 150px;
  text-align: center;
  font-size: 22px;
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
  padding: 0 0 50px 20px;
}
:deep().el-tabs__content {
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
  margin-top: 25px;
}
.attribute-detail {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.methods {
  margin-top: 20px;
}
.method-detail {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.edit-pen {
  cursor: pointer;
  color: grey;
  margin-left: 710px;
}
.noIndicator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 64px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #bdbdbd;
  margin: 16px auto;
}
</style>
