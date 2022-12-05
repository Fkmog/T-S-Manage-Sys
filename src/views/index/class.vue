<template>
  <!-- 顶部搜索栏 -->
  <HeaderSearch>
    <template #rightTime>
      <div class="rightSlot">
        <div class="selects">
          <el-select
            v-model="chosenYear"
            placeholder="全部学年"
            class="selecter"
            @change="getClassList()"
          >
            <el-option
              v-for="item in academicYear"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
          <el-select
            v-model="chosenSemester"
            placeholder="学期"
            class="selecter"
            @change="getClassList()"
          >
            <el-option
              v-for="item in semester"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </div>
      </div>
    </template>
  </HeaderSearch>
  <!-- 添加教学班按钮 -->
  <addBtn @click="dialogFormVisible = true"></addBtn>
  <!-- 弹出表单 -->
  <el-dialog
    v-model="dialogFormVisible"
    title="新建教学班"
    style="width: 800px"
  >
    <el-form
      :model="classAddForm"
      :rules="rules"
      ref="classAddForm"
      label-position="top"
    >
      <el-form-item
        label="课程名"
        :label-width="formLabelWidth"
        prop="className"
      >
        <el-input v-model="classAddForm.className" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="任课教师"
        :label-width="formLabelWidth"
        prop="instructor"
      >
        <el-input v-model="classAddForm.instructor" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="课程号"
        :label-width="formLabelWidth"
        prop="courseCode"
      >
        <el-input v-model="classAddForm.courseCode" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="开课号"
        :label-width="formLabelWidth"
        prop="identifier"
      >
        <el-input v-model="classAddForm.identifier" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="开课学年"
        :label-width="formLabelWidth"
        prop="chosenYear"
      >
        <el-select v-model="classAddForm.chosenYear" placeholder="选择开课学年">
          <el-option
            v-for="item in academicYear"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="开课学期"
        :label-width="formLabelWidth"
        prop="chosenSemester"
      >
        <el-select
          v-model="classAddForm.chosenSemester"
          placeholder="选择开课学期"
        >
          <el-option
            v-for="item in semester"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input
          :rows="2"
          type="textarea"
          v-model="classAddForm.remark"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addClass('classAddForm')">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 教学班展示列表 -->
  <el-table
    class="classesTable"
    :data="classTable"
    style="width: 70%"
    :header-cell-style="{ 'text-align': 'center', 'font-size': '16px' }"
    :cell-style="{ 'text-align': 'center' }"
    highlight-current-row
  >
    <el-table-column prop="className" label="课程名" />
    <el-table-column prop="teacherName" label="任课教师" />
    <el-table-column prop="courseCode" label="课程号" />
    <el-table-column prop="identifier" label="开课号" />
    <el-table-column prop="chosenYear" label="学年" />
    <el-table-column prop="chosenSemester" label="学期" />
    <el-table-column prop="remark" label="备注" />
  </el-table>
</template>

<script>
import HeaderSearch from "@/components/general/headerSearch.vue";
import { getClass, addClass } from "@/api/class";
import { getDictionary } from "@/api/dictionary";
import addBtn from "@/components/general/addBtn.vue";

export default {
  name: "Class",
  components: {
    HeaderSearch,
    addBtn,
  },
  data() {
    return {
      classTable: [],
      academicYear: [],
      semester: [],
      chosenYear: "",
      chosenSemester: "",

      currentInfo: {
        departmentId: Number,
      },

      dialogFormVisible: false,
      formLabelWidth: "140px",
      classAddForm: {
        className: "",
        instructor: "",
        courseCode: "",
        identifier: "",
        chosenYear: "",
        chosenSemester: "",
        remark: "",
      },
      rules: {
        className: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        instructor: [
          { required: true, message: "请输入任课教师", trigger: "blur" },
        ],
        courseCode: [
          { required: true, message: "请输入课程号", trigger: "blur" },
        ],
        identifier: [
          { required: true, message: "请输入开课号", trigger: "blur" },
        ],
        chosenYear: [
          { required: true, message: "请选择开课学年", trigger: "change" },
        ],
        chosenSemester: [
          { required: true, message: "请选择开课学期", trigger: "change" },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    //设置默认当前学院/专业等信息
    this.currentInfo.departmentId = this.$store.state.currentInfo.departmentId;
    this.getClassList();
    this.getDictionary();
  },
  computed: {
    currentChange() {
      return this.$store.state.currentInfo;
    },
  },
  watch: {
    currentChange: {
      deep: true,
      handler(value) {
        this.currentInfo.departmentId =
          this.$store.state.currentInfo.departmentId;
        this.getClassList();
      },
    },
  },
  methods: {
    //获取数据字典
    getDictionary() {
      getDictionary().then((res) => {
        console.log("getDictionary", res);
        this.academicYear = res.academic_year;
        this.semester = res.semester;
      });
    },
    //获取教学班列表
    getClassList() {
      getClass(
        this.chosenYear,
        this.chosenSemester,
        this.currentInfo.departmentId
      ).then((res) => {
        console.log("getClassList", res);
        this.classTable = res.rows;
      });
    },
    //新增教学班
    addClass(classAddForm) {
      this.$refs[classAddForm].validate((valid) => {
        if (valid) {
          addClass(
            this.classAddForm.chosenYear,
            this.classAddForm.chosenSemester,
            this.currentInfo.departmentId,
            this.classAddForm.className,
            this.classAddForm.identifier,
            this.classAddForm.instructor,
            this.classAddForm.courseCode,
            this.classAddForm.remark
          ).then((res) => {
            this.dialogFormVisible = false;
            console.log("addClass", res);
          });
        } else {
          console.log("error submit!!");
          return;
          // this.$refs[formName].resetFields();重置表单内容方法
        }
      });
    },
  },
};
</script>

<style scoped>
.classesTable {
  margin: 0 auto;
  margin-top: 85px;
  box-shadow: 0px 1px 3px rgb(164, 163, 163);
}
.rightSlot {
  position: absolute;
  right: 10%;
  width: 300px;
  margin-top: 10px;
}
.selects {
  display: flex;
  flex-direction: row;
}

.selecter {
  margin-left: 15px;
}
</style>