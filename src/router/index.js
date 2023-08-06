import Cookies from "js-cookie";
import store from "../store";
//引入vue-router4写法
import { createRouter, createWebHistory } from "vue-router";
// 引入组件
import Student from "../views/major/student.vue";
import BaseAddStudent from "@/components/student/addStudent.vue";
import Achieve from "../views/major/achieve.vue";
import Courses from "../views/major/course.vue";
import Goal from "../views/major/goal.vue";
import GoalEdit from "../views/major/goalEdit.vue";
import Manage from "../views/major/manage.vue";
import Setting from "../views/major/setting.vue";

import Index from "@/components/index/index.vue";

import BaseCourse from "@/views/index/baseCourse.vue";
import Class from "@/views/index/class.vue";
import Major from "@/views/index/major.vue";
import DepartmentSetting from "@/views/index/departmentSetting.vue";

import Teacher from "@/views/index/teacher.vue";
import AddTeacher from "@/views/teacher/addTeacher.vue";
import BatchCourseAdd from "@/views/baseCourse/batchCourseAdd.vue";
import BatchClassAdd from "@/components/class/batchAddClass.vue";
import BaseCourseDetail from "@/views/baseCourse/baseCourseDetail.vue";
import baseCourseObjectives from "@/views/baseCourse/objectives.vue";
import baseCourseActivities from "@/views/baseCourse/activities.vue";
import baseCourseIndicators from "@/views/baseCourse/indicators.vue";
import baseCourseIndicatorsEdit from "@/views/baseCourse/indicators-edit.vue";
import baseCourseObjectivesEdit from "@/views/baseCourse/objectives-edit.vue";

//登录组件
import userLogin from "@/components/userLogin/index.vue";

//工作手册模板组件
import TemplateList from "@/views/template/templateList.vue";
import TemplateEdit from "@/views/template/templateEdit.vue";
import Workbook from "@/views/template/workbook.vue";

//教师端组件
import TeacherIndex from "@/views/teacherSide/teacherIndex.vue";
import TeacherClasses from "@/views/teacherSide/teacherClasses.vue";
import TeacherClass from "@/views/teacherSide/teacherClass.vue";
import Students from "@/views/teacherSide/students/students.vue";
import AddScore from "@/views/teacherSide/score/addScore.vue";
import Score from "@/views/teacherSide/score/score.vue";
import Objectives from "@/views/teacherSide/objectives/objectives.vue";
import objectivesEdit from "@/views/teacherSide/objectives/objectives-edit.vue";

//课程管理人端组件
import PrincipalIndex from "@/views/principalSide/principalIndex.vue";
import PrincipalBaseCourseDetail from "@/views/principalSide/baseCourse/baseCourseDetail.vue";
import PrincipalBaseCourse from "@/views/principalSide/baseCourse/baseCourse.vue";
import PrincipalClass from "@/views/principalSide/class/class.vue";

//web管理员组件
import WebAdminIndex from "@/views/webAdmin/webIndex.vue";
import Schools from "@/views/webAdmin/schools/schools.vue";

const router = createRouter({
  //history配置暂未定
  history: createWebHistory(),
  routes: [
    {
      //入口设置成Login页面
      path: "",
      component: userLogin,
    },
    {
      path: "/login",
      component: userLogin,
    },
    //学院管理员端的路由
    {
      path: "/index",
      component: Index,
      children: [
        //主视图下路由
        {
          path: "/baseCourse",
          component: BaseCourse,
          meta: { isMajor: false },
          name: "BaseCourse",
        },
        {
          path: "/class",
          component: Class,
          meta: { isMajor: false },
          name: "Class",
        },
        {
          path: "/teacher",
          component: Teacher,
          meta: { isMajor: false },
        },
        {
          path: "/major",
          component: Major,
          meta: { isMajor: false },
        },
        {
          path: "/departmentSetting",
          component: DepartmentSetting,
          meta: { isMajor: false },
        },
        {
          path: "/addTeacher",
          component: AddTeacher,
          meta: { isMajor: false },
        },
        {
          path: "/batchCourseAdd",
          component: BatchCourseAdd,
          meta: { isMajor: false },
        },
        {
          path: "/batchClassAdd",
          component: BatchClassAdd,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseDetail",
          component: BaseCourseDetail,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseIndicators",
          component: baseCourseIndicators,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseIndicatorsEdit",
          component: baseCourseIndicatorsEdit,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseObjectives",
          component: baseCourseObjectives,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseObjectivesEdit",
          component: baseCourseObjectivesEdit,
          meta: { isMajor: false },
        },
        {
          path: "/baseCourseActivities",
          component: baseCourseActivities,
          meta: { isMajor: false },
        },
        //专业视图下路由
        {
          name: "Goal",
          path: "/goal",
          component: Goal,
          meta: { isMajor: true },
        },
        {
          path: "/edit",
          component: GoalEdit,
          meta: { isMajor: true },
        },
        {
          name: "Courses",
          path: "/courses",
          component: Courses,
          meta: { isMajor: true },
        },
        {
          name: "Achieve",
          path: "/achieve",
          component: Achieve,
          meta: { isMajor: true },
        },
        {
          name: "Student",
          path: "/student",
          component: Student,
          meta: { isMajor: true },
        },
        {
          name: "BaseAddStudent",
          path: "/baseAddStudent",
          component: BaseAddStudent,
          meta: { isMajor: true },
        },
        {
          name: "Manage",
          path: "/manage",
          component: Manage,
          meta: { isMajor: true },
        },
        {
          name: "Setting",
          path: "/setting",
          component: Setting,
          meta: { isMajor: true },
        },
        {
          path: "/addTeacher",
          component: AddTeacher,
        },
        {
          name: "TemplateList",
          path: "/templateList",
          component: TemplateList,
          meta: { isMajor: false },
        },
        {
          name: "TemplateEdit",
          path: "/templateEdit",
          component: TemplateEdit,
          meta: { isMajor: false },
        },
        {
          name: "Workbook",
          path: "/workbook",
          component: Workbook,
          meta: { isMajor: false },
        },
      ],
    },
    // 教师端路由
    {
      path: "/teacherIndex",
      component: TeacherIndex,
      children: [
        {
          name: "TeacherClasses",
          path: "/teacherClasses",
          component: TeacherClasses,
        },
        {
          name: "TeacherClass",
          path: "/teacherClass",
          component: TeacherClass,
        },
        {
          name: "Students",
          path: "/students",
          component: Students,
        },
        {
          name: "AddScore",
          path: "/addScore",
          component: AddScore,
        },
        {
          name: "Score",
          path: "/score",
          component: Score,
        },
        {
          name: "Objectives",
          path: "/objectives",
          component: Objectives,
        },
        {
          name: "ObjectivesEdit",
          path: "/objectivesEdit",
          component: objectivesEdit,
        },
      ],
    },
    {
      path: "/principalIndex",
      component: PrincipalIndex,
      children: [
        {
          name: "principalClass",
          path: "/principalClass",
          component: PrincipalClass,
        },
        {
          name: "principalBaseCourseDetail",
          path: "/principalBaseCourseDetail",
          component: PrincipalBaseCourseDetail,
        },
      ],
    },
    //web管理员
    {
      path: "/webAdminIndex",
      component: WebAdminIndex,
      children: [
        {
          name: "Schools",
          path: "/schools",
          component: Schools,
        },
      ],
    },
  ],
});
router.beforeEach((to, from, next) => {
  const tokenStr = Cookies.get("Admin-Token");
  if (to.path == "/login") {
    // console.log("from", from, to);
    if (!tokenStr) {
      return next();
    }
    if (tokenStr) {
      if (store.state.currentInfo.identity == "学院管理员") {
        next("/major");
      }
      if (store.state.currentInfo.identity == "教师") {
        next("/teacherClasses");
      }
      if (store.state.currentInfo.identity == "课程负责人") {
        next("/principalBaseCourse");
      }
    }
  }
  // console.log(tokenStr);
  else {
    if (!tokenStr) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
