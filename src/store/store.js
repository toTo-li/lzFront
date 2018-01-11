import Vuex from "vuex";
import Vue  from "vue";
import * as types from "./types";

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        // 存放token
        token:null,
        // title
        title:'',
/*****************************************************/ 
        //任务审核修改的任务id
        taskUpdateId:"", 
/*****************************************************/ 
        // 存放目前登录的用户信息
        user:{},
        // 判断用户添加部分的弹出框
        userDialog:false,
        /*
          用来判定弹出框由谁调用：
             0：默认值
             1：添加用户
             2：查看用户
             3：修改用户
             ...
        */ 
        userDialogNum:0,
        // 存放查看用户按钮的信息
        readUser:{},
        // 修改用户的id
        updateId:null,
        // 查看和修改的角色下拉选项
        selectValue:"",
/*****************************************************/ 
        // 判断角色添加部分的弹出框
        roleDialog:false,
        /*
          用来判定弹出框由谁调用：
             0：默认值
             1：添加角色
             2：查看角色
             3：修改角色
             ...
        */ 
        roleDialogNum:0,
        // 存放查看角色按钮的信息
        readRole:null,
        // 修改角色的id
        updateRoleId:null,
        // 添加角色成功后的刷新角色列表的开关
        fresh:1
/*****************************************************/ 
        

        
    },
    mutations:{
        [types.LOGIN]:(state,data)=>{
            localStorage.token = data.token;
            state.token = data.token;
            state.user = data.user;
        },
        [types.LOGOUT]:(state)=>{
            localStorage.removeItem('token');
            state.token = null;
        },
        [types.TITLE]:(state,data)=>{
            state.title = data;
        },
/*****************************************************/ 
        
        //用户管理模块的弹出框控制
        userDialog:(state,data)=>{
            state.userDialog = data.flag;
            state.userDialogNum = data.userDialogNum
            state.updateId = data.updateId || null;
            state.fresh = -data.fresh || 1;
            
        },
        // 查看按钮的用户信息
        readUsers:(state,data)=>{
            state.readUser = data;
        },
        addUserSelectVal:(state,data)=>{
            state.readUser.role = data;
        },
/*****************************************************/ 

        //角色管理模块的弹出框控制
        roleDialog:(state,data)=>{
            state.roleDialog = data.flag;
            state.roleDialogNum = data.roleDialogNum
            state.updateRoleId = data.updateRoleId || null;
            state.fresh = -data.fresh || 1;
        },
        // 查看按钮的角色信息
        readRoles:(state,data)=>{
            state.readRole = data;
        },
/*****************************************************/ 
        getTaskUpdateId:(state,data)=>{
            state.taskUpdateId = data;
        }
/*****************************************************/ 


    }
}); 




