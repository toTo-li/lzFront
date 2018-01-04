<template>
	<div>
		<el-button type="primary" @click="dialogVisible = true">+添加角色</el-button>
    	<!--
    		添加用户的弹出框部分
    	-->
	    <el-dialog
			  :visible.sync="dialogVisible"
			  width="20%"
			  :before-close="handleClose">
			  <!--
			  	添加用户的表单部分
			  	:model="ruleForm"	数据绑定
			  	:rules="rules"	验证规则
			  	ref="ruleForm"  ref被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs对象上		可以获取表单的每个元素以进行验证 
			  	
			  	prop="name"		表单控件相对应的验证规则
			  -->
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
				  <el-form-item label="用户名" prop="name">
				    <el-input v-model="ruleForm.name"></el-input>
				  </el-form-item>
				  <el-form-item label="角色" prop="role">
				    <el-checkbox-group v-model="checkedPermis">
				      <el-checkbox v-for="permi in permissions" :label="permi" :key="permi">{{permi}}</el-checkbox></br>
				    </el-checkbox-group>
				  </el-form-item>
				  
			</el-form>
			<!--弹出框的取消/保存部分-->			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
			</span>
			  
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
					  //是否显示弹出框
	        	dialogVisible: false,
					  //表单数据
		        ruleForm: {
		          name: ''
		        },
		        //表单控件验证规则
		        rules: {
		          name: [
		            { required: true, message: '请输入角色名称', trigger: 'blur' },
		            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
		          ]
		        },
		        //多选数据
        		checkedPermis: [],
        		permissions: ['任务管理', '库存查看', '任务审核', '报表'],
        		isIndeterminate: true
			  }
		    },
		    methods:{
				  //添加用户的保存事件
			    submitForm(formName){
			      	//将弹出框关闭
			      	this.dialogVisible = false;
			      	//关闭后将数据提交
			      	
			    },
			    //弹出框关闭前的确认
			    handleClose(done) {
			        this.$confirm('确认关闭？')
			          .then(_ => {
			            done();
			          })
			          .catch(_ => {});
			    }
		    }
		
	}
</script>

<style>
	.el-checkbox{
		display: block;
	}
	.el-checkbox + .el-checkbox{
		margin-left:0px;
	}
</style>