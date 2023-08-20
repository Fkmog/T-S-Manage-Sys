<template>
  <div v-show="!closeShow">
    <HeaderSearch msg="搜索课程名称" @SearchValue="getSearchValue">
      <template #rightTime>
        <div class="selectionBar">
          <el-row>
            <el-col :span="9">
              <el-select
                v-model="hasDetail"
                class="m-3"
                @change="getSelectedBaseCourse(hasDetail)"
              >
                <el-option
                  v-for="item in hasDetailSeletion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-select
                v-model="currentVersion"
                class="m-3"
                @change="getCourseByYear(currentVersion)"
              >
                <el-option
                  v-for="item in versions"
                  :key="item.versionId"
                  :label="item.label"
                  :value="item.versionId"
                />
              </el-select>
            </el-col>
            <el-col :span="2" style="position: relative; top: 8px" v-show="identity == '学院管理员'">
            </el-col>
          </el-row>
        </div>
      </template>
    </HeaderSearch>
  </div>

  <div v-show="closeShow" class="submenu">
    <el-row>
      <el-col :span="2" class="columnstyle">
        <el-button @click="this.toggleSelection()" class="clearSelected"
          >取消选择</el-button
        >
      </el-col>
      <el-col :span="16" class="columnstyle">
        <div class="numSelectedTeacher">已选中 {{ numSelected }} 门课程</div>
      </el-col>

      <el-col :span="4" v-show="identity == '学院管理员'" class="columnstyle">
        <el-dropdown class="dropdownstyle">
          <el-icon class="dropdownIcon"><MoreFilled /></el-icon>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="this.addPrincipal()">
                <el-icon><User /></el-icon>
                &nbsp添加课程负责人
              </el-dropdown-item>
              <el-dropdown-item @click="this.addWorkbook()">
                <el-icon><Collection /></el-icon>
                &nbsp分配手册模版
              </el-dropdown-item>
              <el-dropdown-item @click="this.deleteRespondent()">
                <el-icon><CircleClose /></el-icon>
                &nbsp删除课程负责人
              </el-dropdown-item>
              <el-dropdown-item
                @click="this.multideleteBaseCourse(this.courseId)"
              >
                <el-icon><Delete /></el-icon>
                &nbsp删除课程
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>

      <el-col :span="6" v-show="identity == '课程负责人'">
      </el-col>
    </el-row>
  </div>

  <div layout="row" flex class="md-padding" v-show="identity == '学院管理员'">
    <addBtn @click="dialogFormVisible = true"></addBtn>

    <el-table
      :data="tableData"
      v-loading="isloading"
      v-show="hasBaseCourse && hasVersion"
      ref="multipleTable1"
      @selection-change="handleSelectionChange"
      @row-click="editTrigger"
      class="el-table-container"
      style="width: 1375px;text-overflow: ellipsis; white-space: nowrap;"
      :header-cell-style="{
        'padding-left': '20px',
        'font-size': '14.4px',
        height: '48px',
        'font-weight': 'bold',
        color: 'black',
      }"
      :cell-style="{
        'padding-left': '20px',
        'font-size': '16px',
        height: '60px',
      }"
      :row-key="rowKey"
    >
      <el-table-column width="55" type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column label="课程名" width="250" label-class-name="textbold">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程号" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程类型" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseType }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程性质" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseNature }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学分" width="80">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.credit }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.respondentName }}&nbsp;&nbsp;</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="工作手册" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span v-show="scope.row.workbookName">{{ scope.row.workbookName }}</span>
            <span v-show="!scope.row.workbookName"></span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-row v-show="showToolIcon">
            <el-col :span="4">
              <el-tooltip content="删除课程">
                <el-button
                  @click.stop="deleteBaseCourse(scope.$index, scope.row.courseId)"
                  class="deleteButton"
                  link
                  style="color: #3f51b5"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="4" v-show="scope.row.versionId">
              <el-tooltip content="查看信息">
                <el-button
                  @click.stop="goBaseCourseDetail(scope.$index, scope.row)"
                  class="deleteButton"
                  link
                  style="color: #3f51b5"
                  ><el-icon><Document /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="8" v-show="!scope.row.versionId">
              <el-tooltip content="添加课程大纲">
                <el-tag
                  class="noBaseCourseDetail"
                  type="danger"
                  @click.stop="addBaseCourseDetail(scope.row)"
                  >无课程大纲</el-tag>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="md-padding" layout="row" flex v-show="identity == '课程负责人'">
    <el-table
      :data="tableData"
      v-show="hasBaseCourse && hasVersion"
      v-loading="isloading"
      ref="multipleTable2"
      class="el-table-container"
      @selection-change="handleSelectionChange"
      @row-click="editTrigger"
      style="width: 1375px;text-overflow: ellipsis; white-space: nowrap;"
      :header-cell-style="{
        'padding-left': '20px',
        'font-size': '14.4px',
        height: '48px',
        'font-weight': 'bold',
        color: 'black',
      }"
      :cell-style="{
        'padding-left': '20px',
        'font-size': '16px',
        height: '60px',
      }"
      :row-key="rowKey"
    >
      <el-table-column width="55" type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column label="课程名" width="250">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程号" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程类型" width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseType }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程性质" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.courseNature }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学分" width="80">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.credit }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.respondentName }}&nbsp;&nbsp;</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="工作手册" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span v-show="scope.row.workbookName">{{ scope.row.workbookName }}</span>
            <span v-show="!scope.row.workbookName">未分配工作手册</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-row v-show="showToolIcon">
            <el-col :span="4" v-show="scope.row.versionId">
              <el-tooltip content="查看信息">
                <el-button
                  @click.stop="goBaseCourseDetail(scope.$index, scope.row)"
                  class="deleteButton"
                  link
                  style="color: #3f51b5"
                  ><el-icon><Document /></el-icon
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="12" v-show="!scope.row.versionId">
              <el-tooltip content="添加课程大纲">
                <el-tag
                  class="noBaseCourseDetail"
                  type="danger"
                  @click.stop="addBaseCourseDetail(scope.row)"
                  >无课程大纲</el-tag
                >
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-show="(!hasBaseCourse && hasVersion)||(!hasBaseCourse && !hasVersion)" class="no-class">没有课程</div>

  <div v-show="!hasVersion && hasBaseCourse" class="no-class">没有版本信息，请去设置，设置版本信息</div>
  <el-dialog v-model="dialogFormVisible"  title="添加基础课程">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item
        label="课程名称"
        :label-width="formLabelWidth"
        prop="courseName"
      >
        <el-input v-model="form.courseName" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="课程代码"
        :label-width="formLabelWidth"
        prop="courseCode"
        :error="C_ErrorMsg"
      >
        <el-input v-model="form.courseCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学分" :label-width="formLabelWidth" prop="credit">
        <el-input v-model="form.credit" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="课程性质"
        :label-width="formLabelWidth"
        prop="courseNature"
      >
        <el-select v-model="form.courseNature" placeholder="请选择课程性质">
          <el-option
            v-for="(nature, index) in courseNatureSource"
            :key="nature"
            :label="nature"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="课程类型"
        :label-width="formLabelWidth"
        prop="courseType"
      >
        <el-select v-model="form.courseType" placeholder="请选择课程类型">
          <el-option
            v-for="(type, index) in courseTypeSource"
            :key="type"
            :label="type"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" />
        </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="goAddBaseCourses">批量添加</el-button>

        <el-button type="primary" @click="submitForm('ruleForm')">
          确认
        </el-button>
        <el-button @click="resetForm('ruleForm')"> 重置 </el-button>
        <el-button
          @click="
            dialogFormVisible = false;
            resetForm('ruleForm');
          "
          >取消</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible1"  title="修改基础课程">
    <el-form :model="preform">
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-input
          v-model="preform.courseName"
          autocomplete="off"
          v-show="identity == '学院管理员'"
        />
        <span v-show="identity == '课程负责人'">{{ preform.courseName }}</span>
      </el-form-item>
      <el-form-item
        label="课程代码"
        :label-width="formLabelWidth"
        :error="C_ErrorMsg_edit"
      >
        <el-input
          v-model="preform.courseCode"
          autocomplete="off"
          v-show="identity == '学院管理员'"
        />
        <span v-show="identity == '课程负责人'">{{ preform.courseCode }}</span>
      </el-form-item>
      <el-form-item label="学分" :label-width="formLabelWidth">
        <el-input v-model="preform.credit" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程性质" :label-width="formLabelWidth">
        <el-select v-model="preform.courseNature" placeholder="请选择课程性质">
          <el-option
            v-for="(nature, index) in courseNatureSource"
            :key="nature"
            :label="nature"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" :label-width="formLabelWidth">
        <el-select v-model="preform.courseType" placeholder="请选择课程类型">
          <el-option
            v-for="(type, index) in courseTypeSource"
            :key="type"
            :label="type"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="preform.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="editBaseCourse"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="showPrinciple"  title="添加负责人">
    <span> 请选择负责人姓名： </span>

    <el-select
      v-model="selectedRespondent"
      :remote-method="remoteMethodinADD"
      :loading="loading"
      remote
      filterable
      reserve-keyword
    >
      <el-option
        v-for="teacher in principleForm"
        :key="teacher.userId"
        :value="teacher.userId"
        :label="teacher.respondentName"
      >
      </el-option>
    </el-select>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPrinciple = false">取消</el-button>
        <el-button type="primary" @click="addRespondent">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="showEditVersionDailogFlag"  title="课程大纲版本号维护">
    <el-form :model="versionForm" :rules="editVersionRules">
      <el-form-item
        v-show="addFlag"
        label="课程大纲版本号"
        :label-width="formLabelWidth"
        prop="name"
        :error="C_ErrorMsg_editVersion_name"
      >
        <el-input v-model="versionForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        v-show="editFlag || deleteFlag"
        label="选择课程大纲版本"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-select
          v-model="currentVersion"
          placeholder="Please enter a keyword"
          @change="selectVersion(currentVersion)"
        >
          <el-option
            v-for="item in versions"
            :key="item.versionId"
            :label="item.label"
            :value="item.versionId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="面向年级"
        :label-width="formLabelWidth"
        prop="enrollYear"
        :error="C_ErrorMsg_editVersion_enrollYear"
      >
        <el-input v-model="versionForm.enrollYear" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="修订年份"
        :label-width="formLabelWidth"
        prop="reviseYear"
        :error="C_ErrorMsg_editVersion_reviseYear"
      >
        <el-input v-model="versionForm.reviseYear" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            showEditVersionDailogFlag = false;
            this.cancelVersionForm();
          "
          >取消</el-button
        >
        <el-button
          v-show="addFlag"
          type="primary"
          :disabled="!submitFlag"
          @click="addVersion()"
        >
          添加课程大纲版本号
        </el-button>
        <el-button
          v-show="editFlag"
          type="warning"
          :disabled="!submitFlag"
          @click="editVersion()"
        >
          修改课程大纲版本号
        </el-button>
        <el-button
          v-show="deleteFlag"
          type="danger"
          :disabled="!submitFlag"
          @click="deleteVersion()"
        >
          删除课程大纲版本号
        </el-button>
      </span>
    </template>
  </el-dialog>
  
  <el-dialog
    v-model="showAddWorkbook"
    title="设置手册模版"
    width="330px"
    :show-close="false"
    :align-center="true"
  >
    <el-select
      v-model="workBookId"
      style="width: 250px; margin-left: 20px"
      placeholder="选择手册模版"
    >
      <el-option
        v-for="(datail) in workBookDetail"
        :key="datail.workbookId"
        :label="datail.name"
        :value="datail.workbookId"
      >
      </el-option>
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddWorkbook = false">取消</el-button>
        <el-button type="primary" @click="submitWorkbook()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  

  <div class="pagination-container" flex>
    <el-row type="flex" justify="center" align="middle" class="loadmorestyle">
      <el-button
        :disabled="loadmoreDisabled"
        link
        plain
        v-show="showLoadmore && hasBaseCourse && !isloading && hasVersion"
        @click="loadmoreCourse()"
        >加载更多</el-button
      >
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request/request";
import HeaderSearch from "@/components/general/headerSearch.vue";
import addBtn from "@/components/general/addBtn.vue";
import { ref, reactive, version } from "vue";
import {
  ElTooltip,
  ElIcon,
  ElInput,
  ElForm,
  ElButton,
  ElTable,
  ElMessage,
  ElMessageBox,
  ElDialog,
  ElDropdown,
  ElTag,
} from "element-plus";
import {
  Back,
  FolderChecked,
  InfoFilled,
  Loading,
  Search,
  Close,
  Plus,
  Delete,
  Edit,
  MoreFilled,
  ArrowDown,
  Document,
  Avatar,
  DocumentChecked,
  User,
  CircleClose,
  Collection
} from "@element-plus/icons-vue";
import { getDictionary } from "@/api/dictionary";
import { setWorkbook,checkWorkbook } from "@/api/workbook";

export default {
  name: "BaseCourse",
  components: {
    request,
    ElTooltip,
    ElIcon,
    ElInput,
    ElForm,
    ElButton,
    ElTable,
    ElMessage,
    ElMessageBox,
    Back,
    FolderChecked,
    InfoFilled,
    Loading,
    Search,
    Close,
    Plus,
    Delete,
    ElDialog,
    ref,
    reactive,
    Delete,
    Edit,
    HeaderSearch,
    addBtn,
    MoreFilled,
    ElDropdown,
    ArrowDown,
    Document,
    ElTag,
    Avatar,
    DocumentChecked,
    User,
    CircleClose,
    Collection
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_name = "请输入版本名称";
      } else {
        let nameformat = /^\d{4}版$/;
        if (!nameformat.test(value)) {
          this.C_ErrorMsg_editVersion_name =
            "请输入正确版本名称格式 例如：2020版";
        } else {
          this.nameFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
    };
    var validateEnrollYear = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_enrollYear = "请输入年份";
      } else {
        let timeformat = /^[1-9]\d{3}$/;
        let numberformat = /^\d+$/;
        if (!numberformat.test(value)) {
          this.C_ErrorMsg_editVersion_enrollYear = "请输入数字";
        } else if (!timeformat.test(value)) {
          this.C_ErrorMsg_editVersion_enrollYear =
            "请输入正确年份格式 例如：2020 ";
        } else {
          this.enrollYearFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
    };
    var validateReviseYear = (rule, value, callback) => {
      if (value === "") {
        this.C_ErrorMsg_editVersion_reviseYear = "请输入年份";
      } else {
        let timeformat = /^[1-9]\d{3}$/;
        let numberformat = /^\d+$/;
        if (!numberformat.test(value)) {
          this.C_ErrorMsg_editVersion_reviseYear = "请输入数字";
        } else if (!timeformat.test(value)) {
          this.C_ErrorMsg_editVersion_reviseYear =
            "请输入正确年份格式 例如：2020 ";
        } else {
          this.reviseYearFlag = true;
          if (this.enrollYearFlag && this.nameFlag && this.reviseYearFlag) {
            this.submitFlag = true;
          } else {
            this.submitFlag = false;
          }
        }
      }
    };

    return {

      hasVersion:Boolean,

      hasDetail: "全部",
      hasDetailSeletion: [
        { label: "全部", value: null },
        { label: "有课程大纲", value: "1" },
        { label: "无课程大纲", value: "0" },
      ],
      submitFlag: false,
      nameFlag: false,
      enrollYearFlag: false,
      reviseYearFlag: false,
      addFlag: false,
      editFlag: false,
      deleteFlag: false,
      versionForm: {
        name: "",
        enrollYear: "",
        reviseYear: "",
        versionId: "",
      },
      C_ErrorMsg_editVersion_name: "",
      C_ErrorMsg_editVersion_enrollYear: "",
      C_ErrorMsg_editVersion_reviseYear: "",

      editVersionRules: {
        name: [{ validator: validateName, trigger: "blur" }],
        enrollYear: [{ validator: validateEnrollYear, trigger: "blur" }],
        reviseYear: [
          { validator: validateReviseYear, trigger: "blur" },
          // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
      },

      showAddWorkbook:false,
      workBookId:'',
      workBookDetail:[],

      showEditVersionDailogFlag: false,
      C_ErrorMsg: "",
      C_ErrorMsg_edit: "",

      showToolIcon: Boolean,

      loadmoreDisabled: Boolean,
      keyword: "",
      Respondentkeyword: "",
      isloading: true,
      hasBaseCourse: Boolean,
      courseTypeSource: [],
      courseNatureSource: [],
      //showSetDetailPage:false,
      showSetDetailPage: false,
      //selectedDetail
      selectedDetail: "",
      //userId
      userId: "",
      //identity
      identity: "",
      //remote option
      loading: false,
      remoteteacher: [],
      //current edit row
      currentEditRow: "",
      //editRespondentPostdata
      editRespondentPostdata: [],
      //editRespondentInfo
      editRespondentInfo: "",
      //respondentInfos
      respondentInfos: "",
      //editPrinciple
      editPrinciple: false,
      //respondentPostdata
      respondentPostdata: [],
      //selected respondent
      selectedRespondent: "",
      //principel form
      principleForm: [],
      //choose principle
      showPrinciple: false,
      //show load button
      showLoadmore: true,
      //form rules
      rules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        courseCode: [
          { required: true, message: "请输入课程代码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        credit: [
          { required: true, message: "请输入课程学分", trigger: "blur" },
          // { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        courseNature: [
          { required: false, message: "请选择课程性质", trigger: "change" },
        ],
        courseType: [
          { required: false, message: "请选择课程类型", trigger: "change" },
        ],
      },

      //from Route
      routeVersionId: "",
      routeCourseId: "",

      //select
      currentVersion: "",
      currentVersionId: Number,
      loading: ref(false),
      options: [],
      versionLabel: [],
      versions: [],

      // isRouterAlive:true,
      closeShow: ref(false),
      multipleSelection: [],
      numSelected: 0,
      clickState: 0,
      courseId: ref([]),

      tableData: reactive([
        {
          courseName: "",
          courseCode: "",
          courseType: "",
          courseNature: "",
          respondentInfos: "",
          respondentName: "",
          credit: "",
          courseYear: "",
          remark: "",
          versionId: "",
        },
      ]),
      pageSize: ref(20),
      pageNum: ref(1),
      departmentId: "",
      schoolId: "",
      dialogFormVisible: ref(false),
      dialogFormVisible1: ref(false),
      formLabelWidth: "140px",

      form: reactive({
        courseName: "",
        courseCode: "",
        courseType: "",
        courseNature: "",
        respondentInfos: "",
        respondentName: "",
        credit: "",
        courseYear: "",
        remark: "",
        versionId: "",
      }),

      preform: reactive({
        courseName: "",
        courseCode: "",
        courseType: "",
        courseNature: "",
        respondentInfos: "",
        respondentName: "",
        credit: "",
        courseYear: "",
        remark: "",
        versionId: "",
      }),

      result: {},
    };
  },
  methods: {
    getSelectedBaseCourse(hasDeatil) {
      this.hasDeatil = hasDeatil;
      console.log("hasDeatil:", this.hasDeatil);
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    cancelVersionForm() {
      this.versionForm = {
        name: "",
        enrollYear: "",
        reviseYear: "",
        versionId: "",
      };
      this.C_ErrorMsg_editVersion_name = "";
      this.C_ErrorMsg_editVersion_enrollYear = "";
      this.C_ErrorMsg_editVersion_reviseYear = "";
      this.nameFlag = false;
      this.enrollYearFlag = false;
      this.reviseYearFlag = false;
    },
    selectVersion(versionId) {
      console.log('versionId',versionId);
      for(const element of this.versions){
        if(element['versionId']==versionId){
          this.versionForm.name = element["label"];
          this.versionForm.enrollYear = element["enrollYear"];
          this.versionForm.reviseYear = element["reviseYear"];
          this.versionForm.versionId = element["versionId"];
        }
      }
      console.log('name:',this.versionForm.name,'enrollYear:',this.versionForm.enrollYear,'reviseYear:',this.versionForm.reviseYear);
    },
    addVersion() {
      let that = this;
      return request({
        url: "/detail/version",
        method: "post",
        data: {
          enrollYear: that.versionForm.enrollYear,
          reviseYear: that.versionForm.reviseYear,
          versionName: that.versionForm.name,
        },
      })
        .then((res) => {
          console.log("edit version res:", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1000,
            });
            that.showEditVersionDailogFlag = false;
            that.versionForm = {
              name: "",
              enrollYear: "",
              reviseYear: "",
              versionId: "",
            };
            that.getDict();
          }
        })
        .catch((e) => {
          console.log("edit version res error:", e);
          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1000,
          });
        });
    },
    editVersion() {
      let that = this;
      return request({
        url: "/detail/version",
        method: "put",
        data: {
          enrollYear: that.versionForm.enrollYear,
          reviseYear: that.versionForm.reviseYear,
          versionName: that.versionForm.name,
          versionId: that.versionForm.versionId,
        },
      })
        .then((res) => {
          console.log("edit version res:", res);
          if (res.code == "SUCCESS") {
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1000,
            });
            that.showEditVersionDailogFlag = false;
            that.versionForm = {
              name: "",
              enrollYear: "",
              reviseYear: "",
              versionId: "",
            };
            that.getDict();
          }
        })
        .catch((e) => {
          console.log("edit version res error:", e);
          ElMessage({
            type: "error",
            message: `更新失败`,
            duration: 1000,
          });
        });
    },
    deleteVersion() {
      let that = this;
      return request({
        url: "/detail/versionRemove/" + that.versionForm.versionId,
        method: "delete",
      })
        .then((res) => {
          console.log("delete version res:", res);
          if (res === 204) {
            ElMessage({
              type: "success",
              message: `删除成功`,
              duration: 1000,
            });
            that.showEditVersionDailogFlag = false;
            that.versionForm = {
              name: "",
              enrollYear: "",
              reviseYear: "",
              versionId: "",
            };
            that.getDict();
          }
        })
        .catch((e) => {
          console.log("edit version res error:", e);
          ElMessage({
            type: "error",
            message: `删除失败`,
            duration: 1000,
          });
        });
    },
    showEditVersionDailog() {
      this.showEditVersionDailogFlag = true;
    },
    getSearchValueforRespondent(data) {
      this.Respondentkeyword = data;
      this.getPrincipleInfo();
    },
    getSearchValue(data) {
      this.keyword = data;
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    async getDict() {
      let that = this;
      this.courseNatureSource = [];
      this.courseTypeSource = [];
      this.versions = [];
      this.versionLabel = [];

      getDictionary().then((res) => {
        console.log("Dict:", res);

        res.course_nature.forEach((nature) => {
          that.courseNatureSource.push(nature.dictLabel);
        });
        res.course_type.forEach((type) => {
          that.courseTypeSource.push(type.dictLabel);
        });
      });
      return request({
        url: "detail/versionList",
        method: "get",
      })
        .then((res) => {
          console.log("versionList:", res);
          
          if (res.code == "SUCCESS" && res.data.length) {
            
            that.hasVersion = true;
            res.data.forEach((year) => {
              let dict = {
                label: year.versionName,
                enrollYear: year.enrollYear,
                reviseYear: year.reviseYear,
                versionId: year.versionId,
              };
              that.versions.push(dict);
              that.versionLabel.push(year.versionName);
            });

            that.currentVersionId = (this.$store.state.course.baseCourseVersionId)?this.$store.state.course.baseCourseVersionId:that.versions[0].versionId;
            console.log('baseCourseVersionId',this.$store.state.course.baseCourseVersionId,'that.versions[0].versionId',that.versions[0].versionId)
            for(const element of that.versions){
              if(element['versionId']==that.currentVersionId){
                that.currentVersion = element["label"];
              }
          }
          }
          else{
            that.hasVersion = false;
            ElMessage({
            type: "error",
            message: `没有版本信息，请先添加版本！`,
            duration: 1000,
          });
          }

        })
        .catch((e) => {
          console.log("error:", e);
          
        });
    },

    rowKey(row) {
      return row.courseId;
    },
    //setDetail
    setDetail() {},
    //remotemethod
    remoteMethodinADD(query) {
      let that = this;
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.Respondentkeyword = query;
          this.getPrincipleInfo().then(() => {
            that.principleForm = that.remoteteacher;
          });
        }, 200);
      } else {
        this.principleForm = [];
      }
    },
    //删除课程负责人
    deleteRespondent() {
      let that = this;
      this.courseId.forEach(function (res) {
        var courseRespondentDict = {
          courseId: res,
          departmentId: that.departmentId,
          schoolId: that.schoolId,
          userId: 0,
        };
        that.editRespondentPostdata.push(courseRespondentDict);
      });

      ElMessageBox.confirm("是否确认删除课程负责人", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return request({
            url: "/system/role/editRespondent",
            method: "post",
            data: this.editRespondentPostdata,
          }).then(function (res) {
            console.log("delete respondent res:", res);
            that.getBaseCourse(that.pageSize, that.pageNum);
            that.editPrinciple = false;
            that.editRespondentPostdata = [];
            if (res.code == "SUCCESS") {
              ElMessage({
                type: "success",
                message: `删除成功`,
                duration: 1000,
              });
            } else {
              ElMessage({
                type: "error",
                message: `删除失败`,
                duration: 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    //添加课程负责人
    addRespondent() {
      let that = this;
      this.courseId.forEach(function (res) {
        var courseRespondentDict = {
          courseId: res,
          departmentId: that.departmentId,
          schoolId: that.schoolId,
          userId: that.selectedRespondent,
        };
        that.respondentPostdata.push(courseRespondentDict);
      });
      return request({
        url: "/system/role/editRespondent",
        method: "post",
        data: this.respondentPostdata,
      }).then(function (res) {
        console.log("respondentPostdata :", res);
        that.getBaseCourse(that.pageSize, that.pageNum);
        that.showPrinciple = false;
        that.respondentPostdata = [];
        if (res.code == "SUCCESS") {
          ElMessage({
            type: "success",
            message: `新建成功`,
            duration: 1000,
          });
        } else {
          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1000,
          });
        }
      });
    },
    //获取负责人信息
    getPrincipleInfo() {
      let that = this;
      return request({
        url: "/teacher/list",
        method: "get",
        params: {
          schoolId: this.schoolId,
          departmentId: this.departmentId,
          selectKeyWord: this.Respondentkeyword,
        },
      }).then(function (res) {
        that.remoteteacher = res.rows.map((item) => {
          return {
            userId: item.userId,
            respondentName: item.teacherName + "(" + item.teacherNumber + ")",
          };
        });
        console.log("principle INfo :", res.rows);
        // res.rows.forEach(function(teacher){
        //   if(teacher.userId){
        //     // that.principleForm.push(teacher);
        //     that.remoteteacher.push(teacher);
        //   }
        // })
      });
    },
    //load more course
    loadmoreCourse() {
      if (this.result.total - this.pageSize >= 20) {
        this.pageSize += 20;
        this.getBaseCourse(this.pageSize, this.pageNum);
      }
      if (
        this.result.total - this.pageSize < 20 &&
        this.result.total > this.pageSize
      ) {
        this.pageSize += this.result.total - this.pageSize;
        this.getBaseCourse(this.pageSize, this.pageNum);
      }
    },
    printworkbook(){
      console.log('workBookId',this.workBookId);
    },
    addWorkbook(){
      let that = this;
      this.showAddWorkbook = true;
      checkWorkbook(this.departmentId).then(function(res){
        console.log(res);
        if(res.code == "SUCCESS"){
          res.rows.forEach((workbook)=>{
            that.workBookDetail.push({'name':workbook.name,'workbookId':workbook.workbookId})
          });
          
        }
      
      }).catch((e)=>{
        console.log('e',e);
      })
    },
    submitWorkbook(){
      let that = this;
      let tempList = [];
      this.courseId.forEach((courseId)=>{
        tempList.push({'courseId':courseId,'workbookId':that.workBookId});
      })
      console.log('tempList',tempList);
      setWorkbook(tempList).then((res)=>{
        console.log('setWorkbook res',res);
        if(res.code == "SUCCESS"){
          that.showAddWorkbook = false;
          ElMessage({
            type: "success",
            message: `分配成功`,
            duration: 1500,
          });
          that.getBaseCourse(that.pageSize, that.pageNum);
        }
      }).catch((e)=>{
        console.log('e',e);
      })
    },
    //添加课程负责人
    addPrincipal() {
      console.log("add principle", this.principleForm);
      this.showPrinciple = true;
    },
    //是否可选
    // selectable(row,index){
    //   if(row.respondentInfos.length){

    //     return !row.respondentInfos.length;
    //   }
    //   else return true;

    // },
    //添加课程
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addBaseCourse();
        } else {
          ElMessage({
            type: "error",
            message: `新建失败`,
            duration: 1000,
          });
          return false;
        }
      });
    },
    //清除输入课程信息
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    getRouter() {
      this.routeVersionId = this.$route.query.versionId;
      this.routeCourseId = this.$route.query.courseId;
      console.log("routeVersion:", this.routeVersionId);
      console.log("routeCourse:", this.routeCourseId);
    },
    addBaseCourseDetail(row) {
      console.log('currentVersionId',this.currentVersionId);
      if(this.currentVersionId){
        let that = this;
      this.versions.forEach((version) => {
        if (version["value"] == that.currentVersionId) {
          that.currentVersion = version["label"];
        }
      });
      let versionMessage =
        "是否确认添加课程大纲（版本：" + this.currentVersion + " ）?";
      ElMessageBox.confirm(versionMessage, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(
          "versionId",
          that.currentVersionId,
          "CourseId",
          that.courseId
        );

        return request({
          url: "/detail",
          method: "post",
          data: {
            versionId: that.currentVersionId,
            courseId: row.courseId,
            departmentId: that.departmentId,
            schoolId: that.schoolId,
          },
        })
          .then(function (res) {
            console.log(res);
            if (res.code == "SUCCESS") {
              ElMessage({
                type: "success",
                message: `新建成功`,
                duration: 1000,
              });
              //成功后根据vesionId和basecouseId获取详细信息
              that.getBaseCourse(that.pageSize, that.pageNum);
            }
            if (res.code == "UNPROCESSABLE ENTITY" && res.msg == "UNPROCESSABLE ENTIT") {
              ElMessage({
                type: "error",
                message: `没有选择课程大纲版本`,
                duration: 1000,
              });
              //成功后根据vesionId和basecouseId获取详细信息
              that.getBaseCourse(that.pageSize, that.pageNum);
            }

          })
          .catch((e) => {
            console.log("e", e);
            ElMessage({
              type: "error",
              message: `新建失败`,
              duration: 1000,
            });
            //失败后退回basecouse页面
            that.getBaseCourse(that.pageSize, that.pageNum);
          });
      });
      }
      else{
        ElMessage({
            type: "error",
            message: `请选择课程大纲！`,
            duration: 1000,
          });
      }
    },

    getCourseByYear(value) {
      if(value){
        this.currentVersionId = value;
        this.$store.commit(
        "course/setbaseCourseVersionId",
        this.currentVersionId
      );
      
        this.getBaseCourse(this.pageSize, this.pageNum);
      }
      else{
        console.log('没有选择版本大纲',value);
      }
     
    },
    clearForm() {
      this.form.courseId = "";
      this.form.courseName = "";
      this.form.courseCode = "";
      this.form.courseType = "";
      this.form.courseNature = "";
      (this.form.respondentInfos = ""),
        (this.form.respondentName = ""),
        (this.form.credit = "");
      this.form.courseYear = "";
      this.form.remark = "";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable1.toggleRowSelection(row);
          this.$refs.multipleTable2.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable1.clearSelection();
        this.$refs.multipleTable2.clearSelection();
        console.log("清空选择触发");
        if (this.clickState == 1) {
          this.clickState = 0;
          this.closeShow = !this.closeShow;
        }
      }
    },
    handleSelectionChange(val) {
      var courseId = [];
      this.multipleSelection = val;
      console.log("选中的信息：", val);
      val.forEach(function (course) {
        let res = course.courseId;
        courseId.push(res);
      });
      if (val.length > 0) {
        this.showToolIcon = false;
        console.log("showToolIcon", this.showToolIcon);
      } else {
        this.showToolIcon = true;
        console.log("showToolIcon", this.showToolIcon);
      }

      this.numSelected = this.multipleSelection.length;
      if (this.clickState != 1) {
        this.closeShow = !this.closeShow;
        this.clickState = 1;
      }
      if (this.clickState == 1 && this.numSelected == 0) {
        this.clickState = 0;
        this.closeShow = !this.closeShow;
      }

      this.courseId = courseId;
      console.log("courseId:", this.courseId);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getBaseCourse(this.pageSize, this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.getBaseCourse(this.pageSize, this.pageNum);
    },

    addBaseCourse() {
      this.C_ErrorMsg = "";
      console.log(this.form);

      let that = this;
      let postData = this.formTopostData(this.form);
      console.log("postData:", postData);

      return request({
        url: "/baseCourse/add",
        method: "post",
        data: postData,
      })
        .then(function (res) {
          if (res.code == "SUCCESS") {
            that.dialogFormVisible = false;
            ElMessage({
              type: "success",
              message: `新建成功`,
              duration: 1000,
            });
            that.clearForm();
            that.getBaseCourse(that.pageSize, that.pageNum);
          }
        })
        .catch((e) => {
          console.log("e", e);
          that.dialogFormVisible = true;
          if (e.code == "E_CODE_EXIST") {
            ElMessage({
              type: "error",
              message: "新建失败，课程已存在",
              duration: 2000,
            });
            that.C_ErrorMsg = "课程已存在，请重新输入";
          } else if (e.code == "DATA_DUPLICATED") {
            ElMessage({
              type: "error",
              message: "新建失败，数据重复",
              duration: 2000,
            });
            that.C_ErrorMsg = "课程已存在，请重新输入";
          } else {
            ElMessage({
              type: "error",
              message: "新建失败",

              duration: 1000,
            });
          }
        });
    },
    getBaseCourse(pageSize, pageNum) {
      let identity = this.identity;
      let tempurl = '';
      let tempparams = {};

      if (identity == "学院管理员") {
        tempurl= "/baseCourse/list";
        tempparams={pageSize: pageSize,
            pageNum: pageNum,
            versionId: this.currentVersionId,
            hasDetail: this.hasDeatil,
            departmentId: this.departmentId,
            schoolId: this.schoolId,
            selectKeyWord: this.keyword,}
      }
      if (identity == "课程负责人") {
        tempurl= "/baseCourse/respondent";
        tempparams={
            pageSize: pageSize,
            pageNum: pageNum,
            versionId: this.currentVersionId,
            userId: this.userId,
            hasDetail: this.hasDeatil,
            departmentId: this.departmentId,
            schoolId: this.schoolId,
            selectKeyWord: this.keyword,}
      }
      console.log(
          "pageSize:",
          pageSize,
          " pageNum:",
          pageNum,
          "versionId",
          this.currentVersionId
        );
        let that = this;
        let courses = [];
        let courseshasVersion = [];
        let numofcourseshasVersion = 0;
        let courseshasNoVersion = [];
        let numofcourseshasNoVersion = 0;
        this.isloading = true;
        this.loadmoreDisabled = true;
        return request({
          url: tempurl,
          method: "get",
          params: tempparams,
        })
          .then(function (res) {
            that.isloading = false;
            that.loadmoreDisabled = false;
            console.log("courseDetails:", res);
            console.log(
              "department:",
              that.departmentId,
              "schoolId:",
              that.schoolId
            );
            if (res.total != 0) {
              that.hasBaseCourse = true;
              res.rows.forEach(function (course) {
                course.courseName = course.courseName;
                course.courseCode = course.courseCode;
                course.courseType = that.courseTypeSource[course.courseType];
                course.courseNature =
                  that.courseNatureSource[course.courseNature];
                course.credit = course.credit;
                if (course.bcDetails.length) {
                  for (const element of course.bcDetails) {
                    if (
                      element.versionId == that.currentVersionId
                    ) {
                      course.versionId = true;
                      break;
                    } else {
                      course.versionId = false;
                    }
                  }
                }

                if (course.respondentInfos) {
                 
                  course.respondentInfos.forEach(function (respondent) {
                    course.respondentName = respondent.respondentName;
                    
                  });
                  
                }
                courses.push(course);
                if (course.versionId) {
                  numofcourseshasVersion++;
                  courseshasVersion.push(course);
                }
                if (!course.versionId) {
                  numofcourseshasNoVersion++;
                  courseshasNoVersion.push(course);
                }
              });
              that.tableData = courses;
              that.result = res;

              if (pageSize >= that.result.total) {
                that.showLoadmore = false;
              } else {
                that.showLoadmore = true;
              }
              console.log(
                "pageSize:",
                pageSize,
                "result.total:",
                that.result.total,
                "showloadmore:",
                that.showLoadmore
              );
            } else {
              that.hasBaseCourse = false;
            }
          })
          .catch((e) => {
            console.log("e", e);
          });
    },
    multideleteBaseCourse(row) {
      let that = this;
      ElMessageBox.confirm("是否确认删除课程？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return request({
            url: "/baseCourse",
            method: "delete",
            data: row,
          })
            .then(function (res) {
              console.log(res);
              if (res === 204) {
                ElMessage({
                  type: "success",
                  message: `删除成功`,
                  duration: 1500,
                });

                that.getBaseCourse(that.pageSize, that.pageNum);
                that.$refs.multipleTable1.clearSelection();
                that.numSelected = 0;
                if (that.clickState == 1) {
                  that.clickState = 0;
                  that.closeShow = !that.closeShow;
                }
              }
            })
            .catch((e) => {
              console.log("e", e);
              if (e.code == "ALREADY_ADD_TO_PROGRAM") {
                ElMessage({
                  type: "error",
                  message: `删除失败,已加入培养方案`,
                  duration: 1500,
                });
              } else if (e.code == "ADD_TO_PROGRAM") {
                // let emessage = '删除失败'+e.data.courseName+"课程已被添加到培养计划中"
                let emessage = "删除失败,课程已被添加到培养计划中";
                ElMessage({
                  type: "error",
                  message: emessage,
                  duration: 2000,
                });
              } else {
                ElMessage({
                  type: "error",
                  message: `删除失败`,
                  duration: 1500,
                });
              }

              that.getBaseCourse(that.pageSize, that.pageNum);
            });
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    deleteBaseCourse(index, row) {
      console.log("deleteCourse", row);
      let that = this;

      ElMessageBox.confirm("是否确认删除课程？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return request({
            url: "/baseCourse" + "/" + row,
            method: "delete",
          })
            .then(function (res) {
              console.log(res);
              if (res === 204) {
                ElMessage({
                  type: "success",
                  message: `删除成功`,
                  duration: 1000,
                });

                that.getBaseCourse(that.pageSize, that.pageNum);
                that.$refs.multipleTable1.clearSelection();
                that.numSelected = 0;
                if (that.clickState == 1) {
                  that.clickState = 0;
                  that.closeShow = !that.closeShow;
                }
              }
            })
            .catch((e) => {
              console.log("e", e);
              if (e.code == "ALREADY_ADD_TO_PROGRAM") {
                ElMessage({
                  type: "error",
                  message: `删除失败,该课程已加入培养方案`,
                  duration: 1000,
                });
              } else {
                ElMessage({
                  type: "error",
                  message: `删除失败`,
                  duration: 1000,
                });
              }

              that.getBaseCourse(that.pageSize, that.pageNum);
            });
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    goBaseCourseDetail(index, row) {
      console.log("goBaseCourseDetail", row);
      let versionName = '';
      for(const element of this.versions){
        if(element['versionId']==this.currentVersionId){
          versionName = element["label"];
        }
      }
     
      this.$store.commit("course/setbaseCourseVersionName", versionName);
      this.$store.commit("course/setbaseCourseVersionFlag", row.versionId);
      this.$store.commit(
        "course/setbaseCourseVersionId",
        this.currentVersionId
      );
      this.$store.commit("course/setbaseCourseCourseId", row.courseId);
      this.$store.commit("course/setbaseCourseCourseName", row.courseName);
      this.$store.commit("course/setbaseCourseCourseCode", row.courseCode);
      this.$store.commit("course/setbaseCourseCourseType", row.courseType);
      this.$store.commit("course/setbaseCourseCourseNature", row.courseNature);
      this.$store.commit("course/setbaseCourseCredit", row.credit);
      this.$store.commit("course/setbaseCourseCourseYear", row.courseYear);
      this.$store.commit("course/setbaseCourseRemark", row.remark);

      this.$router.push({
        path: "/baseCourseDetail",
      });
    },
    editTrigger(val) {
      console.log("选中的信息：", val.courseId);
      this.postDataToform(val);
      this.dialogFormVisible1 = true;
      // return request({
      //   url:'/baseCourse/edit',
      //   method:'post',

      // })
    },
    editBaseCourse() {
      this.C_ErrorMsg_edit = "";
      let that = this;
      console.log("preform:", this.preform);
      return request({
        url: "/baseCourse",
        method: "put",
        data: this.preform,
      })
        .then(function (res) {
          console.log("res:", res);
          if (res.code == "SUCCESS") {
            that.dialogFormVisible1 = false;
            ElMessage({
              type: "success",
              message: `更新成功`,
              duration: 1000,
            });

            that.getBaseCourse(that.pageSize, that.pageNum);
          }

          // that.getBaseCourse(that.pageSize,that.pageNum);
        })
        .catch((e) => {
          that.dialogFormVisible1 = true;
          console.log("e", e);
          if (e.code == "E_CODE_EXIST") {
            ElMessage({
              type: "error",
              message: "更新失败，课程已存在",
              duration: 1000,
            });
            that.C_ErrorMsg_edit = "课程已存在，请重新输入";
          } else if (e.code == "UNAUTHENTICATED") {
            ElMessage({
              type: "error",
              message: "更新失败，无权限",
              duration: 1000,
            });
          } else {
            ElMessage({
              type: "error",
              message: "更新失败",

              duration: 1000,
            });
          }
        });
    },
    goAddBaseCourses() {
      this.$router.push({ path: "/batchCourseAdd" });
    },
    formTopostData(form) {
      let postData = {};
      postData.departmentId = this.departmentId;
      postData.schoolId = this.schoolId;
      postData.courseName = form.courseName;
      postData.courseCode = form.courseCode;
      postData.courseType = form.courseType;
      postData.courseNature = form.courseNature;
      postData.respondentName = form.respondentName;
      postData.credit = form.credit;
      postData.courseYear = form.courseYear;
      postData.remark = form.remark;

      return postData;
    },
    postDataToform(val) {
      this.preform.courseId = val.courseId;
      this.preform.courseName = val.courseName;
      this.preform.courseCode = val.courseCode;
      this.preform.courseType =
        this.courseTypeSource.indexOf(val.courseType) > -1
          ? this.courseTypeSource.indexOf(val.courseType)
          : "";
      this.preform.courseNature =
        this.courseNatureSource.indexOf(val.courseNature) > -1
          ? this.courseNatureSource.indexOf(val.courseNature)
          : "";
      this.preform.credit = val.credit;
      this.preform.respondentName = val.respondentName;
      this.preform.courseYear = val.courseYear == "2022" ? "0" : "1";
      this.preform.remark = val.remark;
    },
    dataTransfrom(course) {
      course.courseName = course.courseName;
      course.courseCode = course.courseCode;
      course.courseType =
        course.courseType == "" ? "" : this.courseTypeSource[course.courseType];
      course.courseNature =
        course.courseNature == ""
          ? ""
          : this.courseNatureSource[course.courseNature];
      course.respondentName = course.respondentName;
      course.credit = course.credit;
      course.courseYear = course.courseYear == "0" ? "2022" : "2023";
      course.remark = course.remark ? "" : course.remark.trim();

      return course;
    },
    activate() {
      this.departmentId = this.$store.state.currentInfo.departmentId;
      this.schoolId = this.$store.state.currentInfo.schoolId;
      this.identity = this.$store.state.currentInfo.identity;
      
      if (this.identity == "课程负责人") {
        this.userId = this.$store.state.userInfo.userId;
      }
    },
  },
  mounted() {
    this.activate();
    this.getDict().then(()=>{
    let identity = this.identity;
    if (identity == "学院管理员") {
      this.getRouter();
      // this.getPrincipleInfo();
      if (this.routeVersionId) {
        this.currentVersionId = this.routeVersionId;
      }
    }
    this.getBaseCourse(this.pageSize, this.pageNum);
    })
    
  },
};
</script>

<style scoped>
.editVersion {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loadmorestyle {
  padding-top: 24px;
  padding-bottom: 24px;
}
.noBaseCourseDetail:hover {
  cursor: pointer;
}
.dropdownIcon {
  margin-left: 10px;
  margin-top: 18px;
  cursor: pointer;
}
.dropdownstyle {
  margin-right: 10px;
}

.no-class {
  margin-top: 120px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}
:deep().el-input__wrapper {
  border-bottom: 1px solid #d5d5d5;
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  box-shadow: 0 0 0 0px;
  border-radius: 0;
}
.el-select:hover:not(.el-select--disabled) :deep().el-input__wrapper {
  box-shadow: 0 0 0 0px;
}
.submenudeleteButton {
  float: right;
  margin-top: 16px;
}

.columnstyle {
  height: 50px;
}
:deep().searchBlock .el-icon {
  height: 24px;
  width: 24px;
}
:deep().searchBlock .el-icon svg {
  height: 24px;
  width: 24px;
}
:deep().el-icon svg {
  height: 18px;
  width: 18px;
}
:deep().el-icon {
  height: 18px;
  width: 18px;
}

.selectionBar {
  position: absolute;
  right: 10%;
  width: 700px;
}
.m-3 {
  float: right;
  top: 6px;
  right: 10%;
}

.dropDown {
  margin-left: 1%;
  width: 100px;
}
.clearSelected {
  color: black;
  margin-top: 11px;
  line-height: 55px;
  float: right;
  align-items: center;
  text-align: center;
  border-radius: 2px;
  outline: none;
  border: 0;
  padding: 0 6px;
  background-color: #f2f2f2;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.clearSelected:hover {
  background-color: #c4c4c4;
}
.headerSearch {
  border: 0;
  float: left;
  width: 50%;
}
.searchBar {
  display: inline-block;
  width: 100%;
  border: 1px solid rgb(189, 189, 189);
}
.md-padding {
  margin: 0 auto;
  margin-top: 85px;
}

.pagination {
  margin-left: 40%;
}
.pagination-container {
  width: 100%;
}
.deleteButton,
.editButton {
  line-height: 55px;
  padding: 0;
  margin: 0;
}
.iconSize {
  top: 7px;
  height: 20px;
  width: 20px;
}
.addIcon {
  color: white;
  width: 24px;
  height: 24px;
  top: 3px;
}
.addCourseButton {
  background-color: rgb(33, 150, 243);
  min-height: 56px;

  float: right;
  top: -34px;
  right: 40px;
}

.addCourseButton:hover {
  background-color: rgb(41, 98, 255);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
}

.el-table-container {
  cursor: pointer;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgb(43 59 93 / 29%), 0 0 13px rgb(43 59 93 / 29%);
}
.submenu {
  color: #3f51b5;
  font-size: 14px;
  font-weight: 500;
  height: 55px;
  position: absolute;
  top: 110px;
  left: 0px;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  background-color: #f2f2f2;
}
.color {
  background-color: #f2f2f2;
}
.deleteButton {
  margin-right: 10px;
  margin-top: 0;
  margin-bottom: 0;
}
.numSelectedTeacher {
  color: #3f51b5;

  line-height: 55px;
  border-radius: 2px;
  border: 0;
  padding: 0 6px;
  margin: 0;
  user-select: none;
  background: transparent;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
