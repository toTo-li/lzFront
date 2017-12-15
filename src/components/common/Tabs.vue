<template>
	  <div>
	  	<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="任务管理" name="first">
		    		任务管理
		    </el-tab-pane>
		    <el-tab-pane label="库存查看" name="second">库存查看</el-tab-pane>
		    <el-tab-pane label="任务审核" name="third">任务审核</el-tab-pane>
		    <el-tab-pane label="报表" name="fourth">报表</el-tab-pane>
		    <el-tab-pane label="权限管理" name="fifth">
		    		<v-user-list></v-user-list>
		    </el-tab-pane>
		  </el-tabs>
	  </div>
</template>

<script>
	import vUserList from '../page/PermissionsManage/UserList.vue' 
	export default {
		  components:{
		  	vUserList
		  },
	    data() {
	      return {
	        activeName: 'first'
	      };
	    },
	    methods: {
	      handleClick(tab, event) {
	        console.log(tab, event);
	      }
	    }
	  };
</script>

<style>
</style>