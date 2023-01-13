<template>
  <div class="head-block">
    <el-row style="margin-left: 30px">
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
          @click="back()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div
        style="
          margin-top: 15px;
          margin-left: 20px;
          height: 30px;
          border-left: 1px solid rgb(189, 189, 189);
        "
      ></div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="保存"
        placement="bottom"
        :hide-after="0"
      >
        <el-icon
          class="icon"
          size="24px"
          color="rgb(137, 137, 137)"
          @click="save()"
          style="margin-left: 20px"
        >
          <DocumentChecked />
        </el-icon>
      </el-tooltip>
    </el-row>
  </div>
  <div class="body">
    <el-tabs class="major-tab">
      <el-tab-pane
        v-model="chosenMajor"
        v-for="major in majorList"
        :key="major.majorId"
        :label="major.majorName"
      >
        <div class="card">
          <span style="color: grey; font-size: 14px; margin-top: 20px"
            >毕业要求指标点</span
          >

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
              <div class="closeIcon">
                <el-icon class="close-icon" @click="deleteIndicator(indicator)"><Close /></el-icon>
              </div>
            </div>

            <!-- 支撑方式 -->
            <div style="margin-left: 90px">
              <div class="support-head">
                <span style="color: grey; font-size: 14px">支撑方式</span>
                <div class="penIcon">
                  <el-icon class="pen-icon" @click="editSupportMethods(indicator)"><EditPen /></el-icon>
                </div>
              </div>
              <div class="methods">
                <div
                  v-for="method in indicator.supportMethodVos"
                  :key="method.id"
                >
                  <div class="method-detail">
                    <div class="method-weight">
                      (&nbsp;{{ method.weight }}%&nbsp;)
                    </div>
                    <div class="method-desc" style="margin-left: 80px">
                      {{ method.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

         <el-button class="add-indicator-button" style="color: #6573c0" text @click="addIndicator()">
            <el-icon :size="18" color="#586dbe"><Plus /></el-icon>
            新增支持指标点
          </el-button>


        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getIndicators, getMajors, getDetailMajor,getIndicatorList } from "@/api/basecourse";
import { getMajorInfo } from "@/api/major";
import {
  Back,
  DocumentChecked,
  Plus,
  Delete,
  Close,
  EditPen,
} from "@element-plus/icons-vue";
export default {
  name: "baseCourseIndicatorsEdit",
  components: {
    Back,
    DocumentChecked,
    Plus,
    Delete,
    Close,
    EditPen,
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
    this.checkMajors();
  },
  methods: {
    back() {
      this.$router.push("/baseCourseIndicators");
    },
    save() {
      console.log("save");
    },
    //查询对应的专业以及bcdmId
    checkMajors() {
      getMajors(this.course.detailId).then((res) => {
        this.majorList = res.rows;
        console.log("this.majorList:", this.majorList);
        for (let i = 0; i < this.majorList.length; i++) {
          getMajorInfo(this.majorList[i].majorId).then((res) => {
            this.majorList[i].majorName = res.data.majorName;
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
          this.programId
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
        });
      }
    },
    //删除指标点
    deleteIndicator(indicator){
        console.log("deleteIndicator",indicator);
    },
    //编辑支撑方式
    editSupportMethods(indicator){
        console.log("editSupportMethods",indicator);
    },
    //新增支持指标点 todo!需要拿到对应的bcdmId 即选中的标签页
    addIndicator(){
        console.log("addIndicator");
        // getIndicatorList()
    }
  },
};
</script>

<style scoped>
.head-block {
  position: absolute;
  top: 110px;
  left: 0px;
  height: 55px;
  border-bottom: 1px solid rgb(189, 189, 189);
  width: 100%;
}
.icon {
  margin-top: 15px;
  margin-left: 10px;
  cursor: pointer;
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
  padding: 0 0 50px 20px;
}
:deep().el-tabs__content {
  overflow: visible;
}
.detail-content {
  width: 600px;
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
.attribute:hover .closeIcon {
  opacity: 1;
}
.closeIcon {
  opacity: 0;
  margin-top: 50px;
  margin-left: 30px;
}
.close-icon {
  cursor: pointer;
}

.support-head{
    display: flex;
    flex-direction: row;
}
.attribute:hover .penIcon{
  opacity: 1;
}
.penIcon{
  opacity: 0;
}
.pen-icon {
  cursor: pointer;
  margin-left:545px;

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
  margin-top: 20px;
}
.add-indicator-button{
    width:150px;
    margin-top:30px
}
</style>