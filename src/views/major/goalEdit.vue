<template>
  <div class="content">
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
            @click="backGoal()"
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
    <div class="edit-body">
      <div class="card">
        <el-form :model="requirements" ref="requirements" label-position="top">
          <el-col v-for="attribute in requirements" :key="attribute.id">
            <el-col>
              <el-row>
                <el-col :span="2" class="two-digits">
                  <section class="num-title">
                    <section class="num-wrap">
                      <span class="title-text">{{ attribute.serialNum }}</span>
                    </section>
                    <section class="rotate-bar"></section>
                  </section>
                </el-col>
                <el-col :span="22">
                  <el-form-item label="简称" class="title">
                    <el-input
                      v-model="attribute.name"
                      maxlength="20"
                      show-word-limit
                      placeholder="简称"
                    />
                  </el-form-item>
                  <el-form-item label="描述" class="title">
                    <el-input
                      v-model="attribute.description"
                      autosize
                      type="textarea"
                      maxlength="1000"
                      placeholder="描述"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col>
                <div
                  class="attribute-detail"
                  v-for="detail in attribute.programIndicators"
                  :key="detail.id"
                >
                  <el-row>
                    <div class="detail-num">
                      {{ detail.serialNum }}
                    </div>
                    <div class="detail-content" style="width: 700px">
                      <el-form-item label="简称" class="title">
                        <el-input
                          v-model="detail.name"
                          maxlength="20"
                          show-word-limit
                          placeholder="简称"
                        />
                      </el-form-item>
                      <el-form-item label="描述" class="title">
                        <el-input
                          v-model="detail.description"
                          autosize
                          type="textarea"
                          maxlength="1000"
                          placeholder="描述"
                        />
                      </el-form-item>
                    </div>
                  </el-row>
                </div>
                <el-row class="detail-Btn">
                  <el-button
                    style="color: #6573c0"
                    text
                    @click="addDetail(attribute)"
                  >
                    <el-icon :size="18" color="#6573c0"><Plus /></el-icon>
                    新增指标点{{ newDetailId(attribute) }}
                  </el-button>
                  <el-button
                    v-show="
                      attribute.programIndicators.length == 0 ? false : true
                    "
                    type="danger"
                    text
                    @click="deleteDetail(attribute)"
                  >
                    <el-icon :size="18" color="#ff0000"><Delete /></el-icon>
                    删除指标点{{ deleteDetailId(attribute) }}
                  </el-button>
                </el-row>
              </el-col>
            </el-col>
          </el-col>

          <el-row class="attribute-Btn">
            <el-button style="color: #6573c0" text @click="addAttribute()">
              <el-icon :size="18" color="#6573c0"><Plus /></el-icon>
              新增毕业要求{{ attributeIdNew }}
            </el-button>
            <el-button
              v-show="canDelete"
              type="danger"
              text
              @click="deleteAttribute()"
            >
              <el-icon :size="18" color="#ff0000"><Delete /></el-icon>
              删除毕业要求{{ attributeIdDelete }}
            </el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { Back, DocumentChecked, Plus, Delete } from "@element-plus/icons-vue";
import { checkProgramByProgramId, editProgram } from "@/api/program";
export default {
  name: "GoalEdit",
  components: {
    Back,
    DocumentChecked,
    Plus,
    Delete,
  },
  data() {
    return {
      currentMajorId: "",
      currentSchoolId: "",
      currentDepartmentId: "",
      programId: "",
      programInfo: {},
      requirements: [],
      attributeIdDelete: "",
      attributeIdNew: "",
      hasDetail: true,
      deteleArray: [],
      canDelete: true, //控制删除毕业要求按钮显示
    };
  },
  mounted() {
    this.programId = this.$route.query.programId;
    this.currentMajorId = this.$store.state.major.majorId;
    this.currentMajorName = this.$store.state.major.majorName;
    this.currentSchoolId = this.$store.state.currentInfo.schoolId;
    this.currentDepartmentId = this.$store.state.currentInfo.departmentId;
    this.checkRequirement();
  },
  methods: {
    // 删除指标点
    deleteDetailId(attribute) {
      if (attribute.programIndicators.length > 0) {
        return attribute.programIndicators[
          attribute.programIndicators.length - 1
        ].serialNum;
      }
    },
    // 新增指标点
    newDetailId(attribute) {
      if (attribute.programIndicators.length > 0) {
        let detailId =
          attribute.programIndicators[
            attribute.programIndicators.length - 1
          ].serialNum.split(".");
        detailId[1] = ++detailId[1];
        return detailId.join(".");
      } else {
        return attribute.serialNum + ".1";
      }
    },
    // 删除要求点
    deleteAttributeId() {
      if (this.requirements && this.requirements.length > 0) {
        this.attributeIdDelete =
          this.requirements[this.requirements.length - 1].serialNum;
      }
    },
    // 新增要求点
    newAttributeId() {
      if (this.requirements && this.requirements.length > 0) {
        let v = this.requirements[this.requirements.length - 1].serialNum;
        this.attributeIdNew = ++v;
      } else {
        this.attributeIdNew = 1;
      }
    },
    //返回上级查看页面
    backGoal() {
      this.$router.push("/goal");
    },
    //查询毕业要求
    checkRequirement() {
      checkProgramByProgramId(this.programId).then((res) => {
        this.programInfo = res.data;
        console.log("programInfo", this.programInfo);
        this.requirements = res.data.graduateAttributes;
        this.deleteAttributeId();
        this.newAttributeId();
        console.log("requirements", this.requirements);
      });
    },

    //新增指标点
    addDetail(attribute) {
      let currentObj = new Object();
      //处理内部字段
      currentObj.name = null;
      currentObj.description = null;
      currentObj.achievement = null;

      //确定serialNum以及id
      if (attribute.programIndicators.length > 0) {
        currentObj.serialNum =
          attribute.programIndicators[
            attribute.programIndicators.length - 1
          ].serialNum;
        let parent = currentObj.serialNum.split(".");
        ++parent[1];
        //确定id
        if (parent[0].length == 1 && parent[1].length == 1) {
          currentObj.id = "0" + parent[0] + "0" + parent[1];
        }
        if (parent[0].length == 2 && parent[1].length == 1) {
          currentObj.id = parent[0] + "0" + parent[1];
        }
        if (parent[0].length == 1 && parent[1].length == 2) {
          currentObj.id = "0" + parent[0] + parent[1];
        }
        if (parent[0].length == 2 && parent[1].length == 2) {
          currentObj.id = parent[0] + parent[1];
        }
        currentObj.serialNum = parent.join(".");
        this.requirements[parent[0] - 1].programIndicators.push(currentObj);
      }
      if (attribute.programIndicators.length == 0) {
        currentObj.serialNum = attribute.serialNum + ".1";
        //确定id
        if (attribute.serialNum.length == 2) {
          currentObj.id = attribute.serialNum;
        }
        if (attribute.serialNum.length == 1) {
          currentObj.id = "0" + attribute.serialNum;
        }
        let num = Number(attribute.serialNum);
        this.requirements[num - 1].programIndicators.push(currentObj);
      }
      console.log("addDetail", currentObj);
    },
    // 删除指标点
    deleteDetail(attribute) {
      ElMessageBox.confirm(
        "是否确定删除指标点" + this.deleteDetailId(attribute) + "?",
        "",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        //复制到待删除数组中
        // this.deteleArray.push(
        //   attribute.programIndicators[attribute.programIndicators.length - 1]
        // );
        // this.deteleArray[this.deteleArray.length - 1].isDeleted = 2;
        attribute.programIndicators.pop();
      });
    },
    //新增要求点
    addAttribute() {
      let currentObj = new Object();
      //处理内部字段
      currentObj.name = null;
      currentObj.description = null;
      currentObj.programIndicators = [];
      if (this.requirements !== null && this.requirements.length > 0) {
        // 确定Id
        let currentId =
          Number(this.requirements[this.requirements.length - 1].id) + 1;
        if (currentId < 10) {
          currentObj.Id = "0" + currentId;
        } else {
          currentObj.Id = currentId.toString;
        }
        // 确定serialNum
        if (this.requirements.length == 0) {
          currentObj.serialNum = "1";
        } else {
          currentObj.serialNum =
            this.requirements[this.requirements.length - 1].serialNum;
          ++currentObj.serialNum;
          currentObj.serialNum = currentObj.serialNum.toString();
        }
        this.requirements.push(currentObj);
      } else {
        currentObj.Id = "01";
        currentObj.serialNum = "1";
        this.requirements = [];
        this.requirements.push(currentObj);
      }
      //显示删除要求点按钮
      this.canDelete = true;
      //更新对应新增删除的要求点的数字
      this.deleteAttributeId();
      this.newAttributeId();
      console.log("addAttribute", currentObj);
      console.log("requirements", this.requirements);
    },
    //删除要求点
    deleteAttribute() {
      console.log("@", this.requirements);
      if (this.requirements.length > 0) {
        ElMessageBox.confirm(
          "是否确定删除毕业要求" + this.attributeIdDelete + "?",
          "",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.requirements.pop();
          if (this.requirements.length == 0) {
            this.canDelete = false;
          }
          //更新对应新增删除的要求点的数字
          this.deleteAttributeId();
          this.newAttributeId();
        });
      }
    },
    //保存毕业要求修改情况
    save() {
      for (let n = 0; n < this.requirements.length; n++) {
        if (this.requirements[n].programIndicators.length > 0) {
          for (
            let m = 0;
            m < this.requirements[n].programIndicators.length;
            m++
          ) {
            if (
              this.requirements[n].programIndicators[m].description == null ||
              this.requirements[n].programIndicators[m].description == ""
            ) {
              //要不要弄个消息弹窗？!!
              return;
            }
          }
        }
        if (
          this.requirements[n].description == null ||
          this.requirements[n].description == ""
        ) {
          return;
        }
      }
      // this.requirements = this.requirements.concat(this.deteleArray);
      this.programInfo.graduateAttributes = this.requirements;
      console.log("save", this.programInfo);
      editProgram(this.programInfo).then((res) => {
        console.log(res);
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `保存成功`,
            duration: 1500,
          });
          this.backGoal();
        } else {
          ElMessage({
            type: "error",
            message: `保存失败`,
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  background-color: #f2f2f2;
}
.detail-Btn {
  margin-left: 100px;
}
:deep().el-input__inner {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
}
.edit-body {
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
}
.card {
  width: 800px;
  background: white;
  padding: 20px;
  margin-top: 80px;
  margin-bottom: 30px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
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
/* 数字标题 */
.num-title {
  margin-top: 10px;
  margin-left: 10px;
  max-width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: table;
  width: 40px;
  color: #5c6bc0;
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.num-wrap {
  max-width: 100%;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  color: rgb(255, 255, 255);
  border-color: rgb(72, 192, 163);
  word-wrap: break-word !important;
}
.title-text {
  max-width: 100%;
  font-size: 50px;
  font-weight: bold;
  color: #5c6bc0;
  box-sizing: border-box !important;
  word-wrap: break-word !important;
}
.rotate-bar {
  margin-top: 5px;
  margin-left: -4px;
  max-width: 100%;
  box-sizing: border-box;
  width: 18px;
  height: 70px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: rgb(198, 198, 199);
  transform: rotate(35deg);
  word-wrap: break-word !important;
  background-color: rgb(254, 254, 254);
}
.detail-num {
  color: #5c6bc0;
  font-weight: bold;
  margin-left: 40px;
  margin-top: 20px;
  font-size: 24px;
}
.attribute-detail {
  display: flex;
  flex-direction: row;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px;
  white-space: nowrap;
  margin-left: 30px;
}
/* 输入框计数 */
:deep().el-input__count {
  font-size: 10px;
  font-weight: 400;
  margin-top: 10px;
}
</style>
