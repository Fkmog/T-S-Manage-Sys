//引入vue-router4写法
import { createRouter, createWebHistory } from 'vue-router'
// 引入组件
import Student from '../views/major/student.vue'
import BaseAddStudent from '@/components/student/addStudent.vue'
import Achieve from '../views/major/achieve.vue'
import Courses from '../views/major/course.vue'
import Goal from '../views/major/goal.vue'
import GoalEdit from '../views/major/goalEdit.vue'
import Manage from '../views/major/manage.vue'
import Setting from '../views/major/setting.vue'

import Index from '@/components/index/index.vue'

import BaseCourse from '@/views/index/baseCourse.vue'
import Class from '@/views/index/class.vue'
import Major from '@/views/index/major.vue'
import Teacher from '@/views/index/teacher.vue'
import AddTeacher from '@/views/teacher/addTeacher.vue'
import BatchCourseAdd from '@/views/baseCourse/batchCourseAdd.vue'
import BaseCourseDetail from '@/views/baseCourse/baseCourseDetail.vue'
import baseCourseObjectives from '@/views/baseCourse/objectives.vue'
import baseCourseActivities from '@/views/baseCourse/activities.vue'
import baseCourseIndicators from '@/views/baseCourse/indicators.vue'
import baseCourseIndicatorsEdit from '@/views/baseCourse/indicators-edit.vue'
import baseCourseObjectivesEdit from '@/views/baseCourse/objectives-edit.vue'


import userLogin from '@/components/userLogin/index.vue'

//教师端组件
import TeacherIndex from '@/views/teacherSide/teacherIndex.vue'
import TeacherClasses from '@/views/teacherSide/teacherClasses.vue'
import TeacherClass from '@/views/teacherSide/teacherClass.vue'
import Students from '@/views/teacherSide/students/students.vue'
import AddScore from '@/views/teacherSide/score/addScore.vue'
import Score from '@/views/teacherSide/score/score.vue'
import Objectives from '@/views/teacherSide/objectives/objectives.vue'

//课程管理人端组件
import PrincipalIndex from '@/views/principalSide/principalIndex.vue'
import PrincipalBaseCourse from '@/views/principalSide/baseCourse/baseCourse.vue'
import PrincipalClass from '@/views/principalSide/class/class.vue'

export default createRouter({
    //history配置暂未定
    history: createWebHistory(),
    routes: [
        {
            //入口设置成Login页面
            path: '',
            component: userLogin
        },
        {
            path: '/login',
            component: userLogin
        },
        //学院管理员端的路由
        {
            path: '/index',
            component: Index,
            children: [
                //主视图下路由
                {
                    path: '/baseCourse',
                    component: BaseCourse,
                    meta: { isMajor: false }
                }, {
                    path: '/class',
                    component: Class,
                    meta: { isMajor: false }
                }, {
                    path: '/teacher',
                    component: Teacher,
                    meta: { isMajor: false }

                }, {
                    path: '/major',
                    component: Major,
                    meta: { isMajor: false }
                },
                {
                    path: '/addTeacher',
                    component: AddTeacher,
                    meta: { isMajor: false }

                },
                {
                    path: '/batchCourseAdd',
                    component: BatchCourseAdd,
                    meta: { isMajor: false }

                },
                {
                    path: '/baseCourseDetail',
                    component: BaseCourseDetail,
                    meta: { isMajor: false }

                },
                {
                    path: '/baseCourseIndicators',
                    component: baseCourseIndicators,
                    meta: { isMajor: false }

                },
                {
                    path: '/baseCourseIndicatorsEdit',
                    component: baseCourseIndicatorsEdit,
                    meta: { isMajor: false }

                },
                {
                    path: '/baseCourseObjectives',
                    component: baseCourseObjectives,
                    meta: { isMajor: false }

                }, {
                    path: '/baseCourseObjectivesEdit',
                    component: baseCourseObjectivesEdit,
                    meta: { isMajor: false }

                },
                {
                    path: '/baseCourseActivities',
                    component: baseCourseActivities,
                    meta: { isMajor: false }

                },
                //专业视图下路由
                {
                    name: "Goal",
                    path: '/goal',
                    component: Goal,
                    meta: { isMajor: true },

                },
                {
                    path: '/edit',
                    component: GoalEdit,
                    meta: { isMajor: true }

                },
                {
                    name: "Courses",
                    path: '/courses',
                    component: Courses,
                    meta: { isMajor: true }

                }, {
                    name: "Achieve",
                    path: '/achieve',
                    component: Achieve,
                    meta: { isMajor: true }

                },
                {
                    name: "Student",
                    path: '/student',
                    component: Student,
                    meta: { isMajor: true }
                },
                {
                    name: "BaseAddStudent",
                    path: '/baseAddStudent',
                    component: BaseAddStudent,
                    meta: { isMajor: true }
                },
                {
                    name: "Manage",
                    path: '/manage',
                    component: Manage,
                    meta: { isMajor: true }

                },
                {
                    name: "Setting",
                    path: '/setting',
                    component: Setting,
                    meta: { isMajor: true }

                },
                {
                    path: '/addTeacher',
                    component: AddTeacher
                },
            ]
        },
        // 教师端路由
        {
            path: '/teacherIndex',
            component: TeacherIndex,
            children: [
                {
                    name: "TeacherClasses",
                    path: '/teacherClasses',
                    component: TeacherClasses
                },
                {
                    name: "TeacherClass",
                    path: '/teacherClass',
                    component: TeacherClass,
                },
                {
                    name: "Students",
                    path: '/students',
                    component: Students,
                },
                {
                    name: "AddScore",
                    path: '/addScore',
                    component: AddScore,
                },
                {
                    name: "Score",
                    path: '/score',
                    component: Score,
                },
                {
                    name: "Objectives",
                    path: '/objectives',
                    component: Objectives,
                },
            ]
        },
        // 课程负责人端路由
        {
            path: '/principalIndex',
            component: PrincipalIndex,
            children: [{
                name: "principalBaseCourse",
                path: '/principalBaseCourse',
                component: PrincipalBaseCourse
            }, {
                name: "principalClass",
                path: '/principalClass',
                component: PrincipalClass
            },]
        }
    ]
})
