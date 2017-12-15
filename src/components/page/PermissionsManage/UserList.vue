<template>
		<div>
			<!--
				el-tabs是用户权限管理列表，其下分为用户管理和角色管理
				当前组件引入了用户表格的组件UserTable.vue
			-->
			
			<!--@tab-click为选项卡选中时的监听事件-->
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				<!--用户管理部分-->
			    <el-tab-pane label="用户管理" name="first">
		    	    <!--用户增加按钮组件-->
		    		<v-user-add></v-user-add>
		    		<!--用户列表组件-->
		    		<v-user-table></v-user-table>
			    </el-tab-pane>
			    
			    <el-tab-pane label="角色管理" name="second">
			    	<!--角色增加按钮组件-->
			    	<v-role-add></v-role-add>
			    	<!--角色列表组件-->
			    	<v-role-table></v-role-table>
			    </el-tab-pane>
			</el-tabs>
		</div>
</template>

<script>
	 import vUserTable from './UserTable.vue';
	 import vUserAdd from './UserAdd.vue';
	 
	 import vRoleTable from './RoleTable.vue'
	 import vRoleAdd from './RoleAdd.vue';
	 export default {
	    data() {
	      return {
	        activeName2: 'first'	        
	      };
	    },
	    methods: {
	      //选项卡被选中时触发的事件
	      handleClick(tab, event) {
	        console.log(tab, event);
	      }
	      
	    },
	    components:{
	    	vUserTable,vUserAdd,
	    	vRoleTable,vRoleAdd
	    }
	};
</script>

<style>
	.el-dialog__body{
		padding:30px 50px 30px 25px;
	}
	.el-select{
		width:40%;
	}
	
</style>