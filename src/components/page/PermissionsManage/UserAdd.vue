<template>
	<div>
		<el-button type="primary" @click="dialogVisible = true">+添加用户</el-button>
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
				    <el-select v-model="roleValue" placeholder="请选择角色权限">
				      <el-option
				      	v-for="item in ruleForm.role"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value"
				      	></el-option>
				    </el-select>
				  </el-form-item>
				  <!--
				  	关联账号这个控件需要根据后台返回的数据进行显示，目前先显示出来
				  -->
				  <el-form-item label="关联账号" prop="rAccount">
				    <el-select v-model="accountValue" placeholder="请选择关联账号（可多选）">
				      <el-option
				      	v-for="item in ruleForm.rAccount"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value"
				      	></el-option>
				    </el-select>
				  </el-form-item>

				  <el-form-item label="联系人" prop="contact">
				    <el-input  v-model="ruleForm.desc"></el-input>
				  </el-form-item>
				  <el-form-item label="Email" prop="Email">
				    <el-input  v-model="ruleForm.desc"></el-input>
				  </el-form-item>
				  <!--<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
				    <el-button @click="resetForm('ruleForm')">重置</el-button>
				  </el-form-item>-->
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
		          name: '',
		          role: [
		             {
		             	value:'role1',
		             	label:'系统管理员'
		             },
		             {
		             	value:'role2',
		             	label:'任务管理'
		             },
		             {
		             	value:'role3',
		             	label:'任务审核'
		             }
		          ],
		          rAccount: [{
			          value: '选项1',
			          label: '黄金糕'
			        }, {
			          value: '选项2',
			          label: '双皮奶'
			        }, {
			          value: '选项3',
			          label: '蚵仔煎'
			        }],
			      contact:'',
		          Email: ''
		        },
		        //角色的默认选项
		        roleValue:'',
		        //关联账号的默认选项，这里的value1要与下拉选项中v-model绑定，并且value1的值要与rAccount中的value值一样，记得value1不能放在ruleForm中，否则会找不到！
		        accountValue:"",
		        //表单控件验证规则
		        rules: {
		          name: [
		            { required: true, message: '请输入活动名称', trigger: 'blur' },
		            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
		          ],
		          role: [
		            { type:'array',required: true, message: '请选择角色权限', trigger: 'change' }
		          ],
		          rAccount: [
		            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
		          ],
		          contact:[
		          	{required:true,message:'请填写联系人',trigger:'blur'}
		          ],
		          Email: [
		            { required: false, message: '请填写Email地址', trigger: 'blur' }
		          ]
		        }
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
</style>
