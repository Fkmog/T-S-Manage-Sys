//引入vue-router4写法
import { createRouter ,createWebHistory} from 'vue-router'
// 引入组件
// import Student from '../views/major/student.vue'
// import Achieve from '../views/major/achieve.vue'
// import Course from '../views/major/course.vue'
// import Target from '../views/major/target.vue'
// import Manage from '../views/major/manage.vue'
// import Setting from '../views/major/setting.vue'

import Index from '@/components/index/index.vue'

import BaseCourse from '@/views/index/baseCourse.vue'
import Class from '@/views/index/class.vue'
import Major from '@/views/index/major.vue'
import Teacher from '@/views/index/teacher.vue'
import userLogin from '@/components/userLogin/index.vue'

export default createRouter({
     //history配置暂未定
    history: createWebHistory(),
    routes:[
        {
            //入口设置成Login页面
            path: '',
            component: userLogin
        },
        {
            path:'/index',
            component:Index,
            children:[
                {
                    path:'/baseCourse',
                    component:BaseCourse
                }, {
                    path:'/class',
                    component:Class
                }, {
                    path:'/teacher',
                    component:Teacher
                }, {
                    path:'/major',
                    component:Major,
                    // children:[
                    //     {
                    //         path:'/baseCourse',
                    //         component:BaseCourse
                    //     },
                    // ]
                }, 
            ]
        },
       

    ]
})

