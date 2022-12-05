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
          size="50px"
          color="rgb(137, 137, 137)"
          @click="backGoal()"
        >
          <Back />
        </el-icon>
      </el-tooltip>
      <div
        style="
          margin-top: 15px;
          margin-left: 10px;
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
          size="50px"
          color="rgb(137, 137, 137)"
          @click="save()"
        >
          <DocumentChecked />
        </el-icon>
      </el-tooltip>
    </el-row>
  </div>
  <div class="edit-body">
    <div class="card">
      <el-form :model="requirements" ref="requirements" label-position="top">
        <el-col v-for="attribute in requirements" :key="attribute.orderNum">
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
                    v-model="attribute.entry"
                    maxlength="20"
                    show-word-limit
                    placeholder="简称"
                    @change="changeAttribute(attribute)"
                  />
                </el-form-item>
                <el-form-item label="描述" class="title">
                  <el-input
                    v-model="attribute.description"
                    autosize
                    type="textarea"
                    maxlength="1000"
                    placeholder="描述"
                    @change="changeAttribute(attribute)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col>
              <div
                class="attribute-detail"
                v-for="detail in attribute.children"
                :key="detail.orderNum"
              >
                <el-row>
                  <div class="detail-num">
                    {{ detail.serialNum }}
                  </div>
                  <div class="detail-content" style="width: 700px">
                    <el-form-item label="简称" class="title">
                      <el-input
                        v-model="detail.entry"
                        maxlength="20"
                        show-word-limit
                        placeholder="简称"
                        @change="changeDetail(detail)"
                      />
                    </el-form-item>
                    <el-form-item label="描述" class="title">
                      <el-input
                        v-model="detail.description"
                        autosize
                        type="textarea"
                        maxlength="1000"
                        placeholder="描述"
                        @change="changeDetail(detail)"
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
                  v-show="attribute.children.length == 0 ? false : true"
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
          <el-button type="danger" text @click="deleteAttribute()">
            <el-icon :size="18" color="#ff0000"><Delete /></el-icon>
            删除毕业要求{{ attributeIdDelete }}
          </el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { Back, DocumentChecked, Plus, Delete } from "@element-plus/icons-vue";
import { checkRequirement, changeRequirement } from "@/api/requirement";
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
      // formRule: {
      //   description: [{ required: true, message: "必填", trigger: "blur" }],
      //   // detailDescription:[{required: true, message: '必填', trigger: 'blur'}]
      // },
      currentMajorId: "",
      currentSchoolId: "",
      currentDepartmentId: "",
      programId: "",
      requirements: [],
      attributeIdDelete: "",
      attributeIdNew: "",
      hasDetail: true,
      deteleArray: [],
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
      if (attribute.children.length > 0) {
        return attribute.children[attribute.children.length - 1].serialNum;
      }
    },
    // 新增指标点
    newDetailId(attribute) {
      if (attribute.children.length > 0) {
        let detailId =
          attribute.children[attribute.children.length - 1].serialNum.split(
            "."
          );
        detailId[1] = ++detailId[1];
        return detailId.join(".");
      } else {
        return attribute.serialNum + ".1";
      }
    },
    // 删除要求点
    deleteAttributeId() {
      this.attributeIdDelete =
        this.requirements[this.requirements.length - 1].serialNum;
    },
    // 新增要求点
    newAttributeId() {
      let v = this.requirements[this.requirements.length - 1].serialNum;
      this.attributeIdNew = ++v;
    },
    //返回上级查看页面
    backGoal() {
      this.$router.push("/goal");
    },
    //查询毕业要求
    checkRequirement() {
      checkRequirement(this.programId).then((res) => {
        this.requirements = res.data;
        this.deleteAttributeId();
        this.newAttributeId();
        console.log("requirements", this.requirements);
      });
    },
    //新增指标点
    addDetail(attribute) {
      let currentObj = new Object();
      //处理内部字段
      currentObj.entry = null;
      currentObj.description = null;
      currentObj.isDeleted = 0;
      currentObj.departmentId = this.currentDepartmentId;
      //确定orderNum
      if (attribute.children.length > 0) {
        currentObj.orderNum =
          attribute.children[attribute.children.length - 1].orderNum + 1;
      }
      if (attribute.children.length == 0) {
        currentObj.orderNum = 1;
      }
      currentObj.programId = this.programId;
      currentObj.requirementId = null;
      currentObj.schoolId = this.currentSchoolId;
      //确定serialNum
      if (attribute.children.length > 0) {
        currentObj.serialNum =
          attribute.children[attribute.children.length - 1].serialNum;
        let parent = currentObj.serialNum.split(".");
        ++parent[1];
        currentObj.serialNum = parent.join(".");
        this.requirements[parent[0] - 1].children.push(currentObj);
      }
      if (attribute.children.length == 0) {
        currentObj.serialNum = attribute.serialNum + ".1";
        let num = Number(attribute.serialNum);
        this.requirements[num - 1].children.push(currentObj);
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
        this.deteleArray.push(
          attribute.children[attribute.children.length - 1]
        );
        this.deteleArray[this.deteleArray.length - 1].isDeleted = 2;

        attribute.children.pop();
      });
    },
    //新增要求点
    addAttribute() {
      let currentObj = new Object();
      //处理内部字段
      currentObj.entry = null;
      currentObj.description = null;
      currentObj.children = [];
      currentObj.isDeleted = 0;
      currentObj.programId = this.programId;
      currentObj.schoolId = this.currentSchoolId;
      currentObj.requirementId = null;
      currentObj.departmentId = this.currentDepartmentId;
      //确定orderNum
      if (this.requirements.length == 0) {
        currentObj.orderNum = 1;
      } else {
        currentObj.orderNum =
          this.requirements[this.requirements.length - 1].orderNum + 1;
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
      //更新对应新增删除的要求点的数字
      this.deleteAttributeId();
      this.newAttributeId();
      console.log("addAttribute", currentObj);
      console.log("requirements", this.requirements);
    },
    //删除要求点
    deleteAttribute() {
      console.log("!!", this.attributeIdDelete);
      ElMessageBox.confirm(
        "是否确定删除毕业要求" + this.attributeIdDelete + "?",
        "",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        //复制到待删除数组中
        this.deteleArray.push(this.requirements[this.requirements.length - 1]);
        this.deteleArray[this.deteleArray.length - 1].isDeleted = 2;
        this.requirements.pop();
        //更新对应新增删除的要求点的数字
        this.deleteAttributeId();
        this.newAttributeId();
      });
    },
    //标注要求的修改
    changeAttribute(attribute) {
      attribute.isDeleted = 1;
    },
    //标注指标点的修改
    changeDetail(detail) {
      detail.isDeleted = 1;
    },
    //保存毕业要求修改情况 要不要弄个消息弹窗？!!todo
    save() {
      for (let n = 0; n < this.requirements.length; n++) {
        if (this.requirements[n].children.length > 0) {
          for (let m = 0; m < this.requirements[n].children.length; m++) {
            if (this.requirements[n].children[m].description == null||this.requirements[n].children[m].description == '') {
              //要不要弄个消息弹窗？!!
              return;
            }
          }
        }
        if (this.requirements[n].description == null||this.requirements[n].description == '') {
          return;
        }
      }
      this.requirements = this.requirements.concat(this.deteleArray);
      console.log("save", this.requirements);
      changeRequirement(this.requirements).then((res) => {
        console.log(res);
        ElMessage({
          type: "success",
          message: `保存成功`,
          duration:1000,
        });
        this.backGoal();
      });
    },
  },
};
</script>

<style scoped>
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
  margin-top: 75px;
}
.card {
  width: 800px;
  background: white;
  padding: 20px;
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
  margin-top: 5px;
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