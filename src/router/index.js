import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/store'
import * as types from '../store/types'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            // 使用meta属性来设置页面是否需要登录权限
            meta:{
                requireAuth:true,
            },
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
					redirect:'/basetable'
                },
                // {
                // 	path:"/readme",
                // 	component:resolve => require(['../components/page/Readme.vue'],resolve)
                // },
                // {
                //     path: '/basetable',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve)
                // },
                // {
                //     path: '/vuetable',
                //     component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
                // },
                // {
                //     path: '/baseform',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                // },
                // {
                //     path: '/vueeditor',
                //     component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                // },
                // {
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                // },
                // {
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                // },
                // {
                //     path: '/basecharts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                // },
                // {
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                // },

                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/TaskManage/TaskManage.vue'], resolve)    // 任务管理组件
                },
                {
                    path: '/baseform',
                    component: resolve => require(['../components/page/StockList/StockList.vue'], resolve)    // 库存查看组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/TaskList/TaskCheckList.vue'], resolve)    // 任务审核组件
                },
                {
                    path: '/taskcheckread',
                    component: resolve => require(['../components/page/TaskList/taskCheckRead.vue'], resolve)    // 任务审核查看组件
                },
                // {
                //     path: '/drag',
                //     component: resolve => require(['../components/page/ReportTable/ReportTable.vue'], resolve)    // 报表组件
                // },
                {
                    path: '/tasktable',
                    component: resolve => require(['../components/page/ReportTable/Report.vue'], resolve)    // 任务报表组件
                },
                {
                    path: '/groupstable',
                    component: resolve => require(['../components/page/ReportTable/CommunityList.vue'], resolve)    // 任务报表组件
                },
                {
                    path: '/manage',
                    component: resolve => require(['../components/page/PermissionsManage/UserList.vue'], resolve)    // 用户管理组件
                },
                {
                    path: '/addtask',
                    component: resolve => require(['../components/page/TaskManage/NewTaskPictures.vue'], resolve)    // 新建投放任务组件
                }
                ,
                {
                    path: '/updatetask',
                    component: resolve => require(['../components/page/TaskManage/TaskManageUpdate.vue'], resolve)    // 修改投放任务组件
                }
                ,
                {
                    path: '/readtask',
                    component: resolve => require(['../components/page/TaskManage/TaskManageRead.vue'], resolve)    // 查看投放任务组件
                }
                ,
                {
                    path: '/changepass',
                    component: resolve => require(['../components/page/ChangePass.vue'], resolve)    // 修改投放任务组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }
    ]
});
//
if(window.localStorage.getItem('token')){
    store.commit(types.LOGIN,{token:window.localStorage.getItem('token')});
}
router.beforeEach((to,from,next)=>{

    if(to.matched.some(r=>r.meta.requireAuth)){
        if(store.state.token){
            next();
        }else{
            next({
                path:"/login",
                // query:{redirect:to.fullPath}
            });
        }
    }else{
        next();
    }

});



export default router;
