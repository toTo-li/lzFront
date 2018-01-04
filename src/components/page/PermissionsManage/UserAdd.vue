<template>
	<div>
		<el-button type="primary" @click="openUserDialog">+添加用户</el-button>
	    	<!--
	    		添加用户的弹出框部分
	    	-->
	    	<el-dialog
			  :visible.sync="userdialogVisible"
			  width="20%"
			  :before-close="handleClose">
			  <!--
			  	添加用户的表单部分
			  	:model="ruleForm"	数据绑定
			  	:rules="rules"	验证规则
			  	ref="ruleForm"  ref被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs对象上		可以获取表单的每个元素以进行验证

			  	prop="name"		表单控件相对应的验证规则
			  -->
			  <el-form :model="ruleForms" :rules="rules" ref="ruleForms" label-width="100px">
				  <el-form-item label="用户名" prop="name">
				    <el-input v-model="ruleForms.name" :disabled="disabled"></el-input>
				  </el-form-item>
					<el-form-item label="密码" prop="password" v-if="passwordFlag">
				    <el-input v-model="ruleForms.password" :disabled="disabled"></el-input>
				  </el-form-item>
				  <el-form-item label="角色" prop="role">
				    <el-select v-model="roleValue" placeholder="请选择角色权限" :disabled="disabled">
				      <el-option
				      	v-for='item in ruleForm.role'
				      	:key="item.id"
				      	:label="item.name"
				      	:value="item.id"
				      	></el-option>
							 <!-- <el-option label="系统管理员" value="1"></el-option>
     					 <el-option label="任务管理" value="2"></el-option>
     					 <el-option label="任务审核" value="3"></el-option> -->
								
				    </el-select>
				  </el-form-item>
				  <!--
				  	关联账号这个控件需要根据后台返回的数据进行显示，目前先不显示出来
				  -->
				  <el-form-item label="关联账号" prop="rAccount" v-if="false">
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
				    <el-input  v-model="ruleForms.contactName" :disabled="disabled"></el-input>
				  </el-form-item>
				  <el-form-item label="Email" prop="Email">
				    <el-input  v-model="ruleForms.email" :disabled="disabled"></el-input>
				  </el-form-item>
				  <!--<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
				    <el-button @click="resetForm('ruleForm')">重置</el-button>
				  </el-form-item>-->
				</el-form>
			  <!--弹出框的取消/保存部分-->
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="close('ruleForms')">取 消</el-button>
			    <el-button type="primary" @click="submitForm('ruleForms')">保存</el-button>
			  </span>

			</el-dialog>
	</div>
</template>

<script>
  // 这里引入状态管理模块
  import store from "../../../store/store";
	export default {
		data(){
			return {
				//是否显示弹出框
	        	dialogVisible: false,
				//表单数据
		        ruleForm: {
		          name: '',
		          role: [
		             
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
			        contactName:'',
							email: '',
							password:''
		        },
		        //角色的默认选项
		        roleValue:'',
		        //关联账号的默认选项，这里的value1要与下拉选项中v-model绑定，并且value1的值要与rAccount中的value值一样，记得value1不能放在ruleForm中，否则会找不到！
		        accountValue:"",
		        //表单控件验证规则
		        rules: {
		          name: [
		            { required: true, message: '请输入用户名', trigger: 'blur' }
							],
							password: [
		            { required: true, message: '请输入密码', trigger: 'blur' }
		          ],
		          role: [
		            { required: true, message: '请选择角色权限', trigger: 'blur' }
		          ],
		          rAccount: [
		            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
		          ],
		          contactName:[
		          	{required:true,message:'请填写联系人',trigger:'blur'}
		          ],
		          Email: [
		            { required: false, message: '请填写Email地址', trigger: 'blur' }
		          ]
						},
						// 只读
						disabled:false,
						// 密码显示
						passwordFlag:false
			  }
				},
				computed:{
					    // 由用户添加按钮和查看按钮触发弹出框
							userdialogVisible:{
								 get(){
									  var self = this;
									  self.$axios.get('/roles/all').then(function(res){
											self.ruleForm.role = res.data;
										})
										return store.state.userDialog;
								 },
								 set(){
											
								 }
							},
							// 当状态管理器中的状态改变 判断由哪个操作按钮触发弹出框并显示对应的样式
							ruleForms:{
								get(){
									if(store.state.userDialogNum==1){
											this.disabled = false;
										  this.passwordFlag = true;
										  return this.ruleForm;
									}else{
										  this.passwordFlag = false;
											if(store.state.userDialogNum==2){
													this.disabled = true;
													return store.state.readUser;
											}else if(store.state.userDialogNum==3){
												  // this.roleValue = store.state.updateId;
													this.disabled = false;
													return store.state.readUser;
											}else{
													this.disabled = false;
													return this.ruleForm;
											}
									}
								},
								set(){}
							}
				},
		    methods:{
				  //添加用户的保存事件
			    submitForm(formName){
								/*
								  private int id;
									private String name;
									private String password;//密码
									private String email;//email
									private Integer roleId;
									private Integer status;//0=未冻结，1=冻结
									private String contactName;
									private String remarks;
								
								*/ 
							
							let users = this.ruleForm;
							var self = this;
							if(store.state.userDialogNum==1){
									self.$refs[formName].validate((valid)=>{
											if(valid){
													// 用户添加 
													this.$axios.post('/users',{
															name:users.name,
															password:users.password,
															email:users.email,
															roleId:this.roleValue,
															contactName:users.contactName,
															status:0
													}).then(function(res){

														if(res.status == 200 || res.status==201){
															self.$message({
																message: '用户添加成功！',
																type: 'success'
															});
															self.$store.commit("userDialog",{userDialogNum:1,flag:false});
														}else{
															self.$message.error('用户添加失败！');
														}

													});
											}else{
												return false;
											}
									})
							}else if(store.state.userDialogNum==2){
										self.$store.commit("userDialog",{userDialogNum:2,flag:false});
							}else if(store.state.userDialogNum==3){
										self.$axios.put(`/users/${store.state.updateId}`,{
											        name:store.state.readUser.name,
															email:store.state.readUser.email,
															roleId:this.roleValue || 1,
															contactName:store.state.readUser.contactName,
										}).then(function(res){
											if(res.status == 200){
													self.$message({
														message: '用户修改成功！',
														type: 'success'
													});
													self.$store.commit("userDialog",{userDialogNum:3,flag:false});
											}
										})
							}

					},
					// 取消添加用户弹出框
					close(formName){
						this.$store.commit("userDialog",{userDialogNum:1,flag:false});
						this.$refs[formName].resetFields();
					},
			    //弹出框关闭前的确认
			    handleClose(done) {
			        this.$confirm('确认关闭？')
			          .then(_ => {
									this.$store.commit("userDialog",{userDialogNum:1,flag:false});
			          })
			          .catch(_ => {});
					},
					openUserDialog(){
						 this.$store.commit("userDialog",{userDialogNum:1,flag:true});
					}

		    }

	}
</script>

<style>
</style>
