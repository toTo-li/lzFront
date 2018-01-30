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
			  <el-form :model="ruleForms" :rules="rules"  ref="ruleForms" label-width="100px">
				  <el-form-item label="用户名:" prop="name">
				    <el-input v-model="ruleForms.name" :readonly="disabled" @blur="checkName" ></el-input>
				  </el-form-item>
					<el-form-item label="密码:" prop="password" v-if="passwordFlag">
				    <el-input type="password" v-model="ruleForms.password" :readonly="disabled"></el-input>
				  </el-form-item>
				  <el-form-item label="角色:" prop="roleName">
				    <el-select v-model="roleName" :readonly="disabled"  @change="get" v-if="this.$store.state.userDialogNum!=2">
				      <el-option
				      	v-for='item in ruleForms.role'
				      	:key="item.id"
				      	:label="item.name"
				      	:value="item.id"
				      	></el-option>
				    </el-select>
						<el-input  v-model="roleName" :readonly="disabled" v-else></el-input>
				  </el-form-item>
				  <!--
				  	关联账号这个控件需要根据后台返回的数据进行显示，目前先不显示出来
				  -->
				  <el-form-item label="关联账号:" prop="rAccount" v-if="rAccountFlag">
				    <el-select v-model="rAccount" placeholder="请选择关联账号（可多选）" multiple>
				      <el-option
				      	v-for="item in ruleForm.rAccount"
				      	:key="item.id"
				      	:label="item.name"
				      	:value="item.id"
				      	></el-option>
				    </el-select>
				  </el-form-item>
					<el-form-item label="关联账号:"  v-if="this.$store.state.userDialogNum==2&&ruleForms.linked.length>0">
							<div v-for="(item,index) in ruleForms.linked" :key="index">
								{{item.name}}
							</div>
				  </el-form-item>

				  <el-form-item label="联系人:" prop="contactName">
				    <el-input  v-model="ruleForms.contactName" :readonly="disabled"></el-input>
				  </el-form-item>
				  <el-form-item label="Email:" prop="email">
				    <el-input  v-model="ruleForms.email" :readonly="disabled"></el-input>
				  </el-form-item>
				</el-form>
			  <!--弹出框的取消/保存部分-->
			  <span slot="footer" class="dialog-footer" v-if="this.$store.state.userDialogNum==1">
			    <el-button @click="close('ruleForms')">取 消</el-button>
			    <el-button type="primary" @click="submitForm('ruleForms')">保存</el-button>
			  </span>
				<span slot="footer" class="dialog-footer" v-else>
			    <el-button @click="submitForm('ruleForms')">返 回</el-button>
			    <!-- <el-button type="primary" @click="submitForm('ruleForms')">保存</el-button> -->
				</span>

			</el-dialog>
	</div>
</template>

<script>
  // 这里引入状态管理模块
  import store from "../../../store/store";
	export default {
		data(){
			var validName = function(rule,value,callback){
				  if(!value){
						callback(new Error('请输入用户名'));
					}else{
						if(value.length<50){
							if(/^[a-zA-Z0-9_]+$/.test(value)==false){
									callback(new Error('只能填写字母、数字、下划线'))
							}else{
								callback();
							}
						}else{
							callback(new Error('长度不能超过50'));
						}
					}
			};
			var validPass = function(rule,value,callback){
				  if(!value){
						callback(new Error('请输入密码'));
					}else{
						if(value.length>=6&&value.length<=16){
							if(/^[a-zA-Z0-9_]+$/.test(value)==false){
									callback(new Error('只能填写字母、数字、下划线'))
							}else{
								callback();
							}
						}else{
							callback(new Error('密码长度要求6-16位'));
						}
					}
			}
			var validEmail = function(rule,value,callback){
				  if(value){
						if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)==false){
							callback(new Error('请输入正确的Email'));
						}else{
							callback();
						}
					}else{
						callback();
					}
				  
			}
			var validrAccount = function(rule,value,callback){
				if(!value){
						callback(new Error('请选择关联账号（可多选）'));
				}else{
						callback();
				}
				
			}
			return {
				//是否显示弹出框
						dialogVisible: false,
				//表单数据
		        ruleForm: {
		          name: '',
		          role: [],
			        contactName:'',
							email: '',
							password:'',
							roleName:"",
							rAccount:[]
		        },
		        //角色的默认选项
		        roleName:"",
		        //关联账号的默认选项，这里的value1要与下拉选项中v-model绑定，并且value1的值要与rAccount中的value值一样，记得value1不能放在ruleForm中，否则会找不到！
						rAccount:[],
						rAccountFlag:false,
		        //表单控件验证规则
		        rules: {
		          name: [
		            {required: true, trigger: 'blur' ,validator:validName}
							],
							password: [
		            { required: true,  trigger: 'blur' ,validator:validPass}
		          ],
		          roleName: [
		            { required: true, message: '请选择角色权限', trigger: 'blur' }
		          ],
		          rAccount: [
		            { type: 'array', required: true, trigger: 'change',validator:validrAccount }
		          ],
		          contactName:[
		          	{required:false,message:'请填写联系人',trigger:'blur'}
		          ],
		          email: [
		            { required: false, trigger: 'blur',validator:validEmail }
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
											self.$store.commit("addUserSelectVal",res.data)
										});
										return store.state.userDialog;
								 },
								 set(){
											
								 }
							},
							// 当状态管理器中的状态改变 判断由哪个操作按钮触发弹出框并显示对应的样式
							ruleForms:{
								get(){
									if(store.state.userDialogNum==1){
										  // 是否为只读
											this.disabled = false;
											// 密码框的显示
											this.passwordFlag = true;
											// 角色的默认选项
											this.roleName = this.ruleForm.role[0].name;
											this.ruleForm.roleName = this.ruleForm.role[0].name;
											// this.ruleForm.name = "";
										  return this.ruleForm;
									}else{
										  this.passwordFlag = false;
											if(store.state.userDialogNum==2){
													this.disabled = true;
													this.roleName = store.state.readUser.roleName;
													console.log(store.state.readUser);
													return store.state.readUser;
											}else if(store.state.userDialogNum==3){
												  // // this.roleName = store.state.updateId;
													// this.disabled = false;
													// this.roleName = store.state.readUser.roleName;
													// // 解决下拉框的下拉选项没用值的问题
													// this.ruleForm.name = store.state.readUser.name;
													// this.ruleForm.contactName = store.state.readUser.contactName;
													// this.ruleForm.email = store.state.readUser.email;
													// return this.ruleForm;
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
							let users = this.ruleForm;
							var self = this;
							if(store.state.userDialogNum==1){
								var rAccounts = self.rAccount instanceof Array?self.rAccount.join(','):"";
								  console.log(rAccounts);
									self.$refs[formName].validate((valid)=>{
											if(valid){
													// 用户添加 
													console.log(this.ruleForms,1111111111);
													self.$axios.get(`/users/checkName/${self.ruleForms.name}`).then(function(res){
														if(!res.data){
																self.$message({
																	message: '用户已存在，请重新输入！',
																	type: 'error'
																}); 
														}else{
															self.$axios.post('/users',{
																	name:users.name,
																	password:users.password,
																	email:users.email,
																	roleId:self.roleName==self.ruleForm.role[0].name?self.ruleForm.role[0].id:self.roleName,
																	contactName:users.contactName,
																	status:0,
																	linkIds:rAccounts
															}).then(function(res){
																console.log(res);
																if(res.status == 200 || res.status==201){
																	self.$message({
																		message: '用户添加成功！',
																		type: 'success'
																	});
																	console.log(self.ruleForms,3232323);
																	
																	self.ruleForm.password="";
																	self.ruleForm.name = "";
																	self.ruleForm.contactName = "";
																	self.ruleForm.email = "";
																	self.rAccount = "";
																	self.$store.commit("userDialog",{userDialogNum:1,flag:false,fresh:store.state.fresh});
																}else{
																	self.$message.error('用户添加失败！');
																}
		
															});
														}
													})
											}else{
												return false;
											}
									})
							}else if(store.state.userDialogNum==2){
										self.$store.commit("userDialog",{userDialogNum:2,flag:false});
							}else if(store.state.userDialogNum==3){
											// self.$axios.put(`/users/${store.state.updateId}`,{
											// 					name:store.state.readUser.name,
											// 					email:store.state.readUser.email,
											// 					roleId:self.roleName==store.state.readUser.roleName?self.getRoleId(self.roleName)[0].id:self.roleName,
											// 					contactName:store.state.readUser.contactName,
											// }).then(function(res){
											// 	console.log(res);
											// 	if(res.status == 200){
											// 			self.$message({
											// 				message: '用户修改成功！',
											// 				type: 'success'
											// 			});
											// 			  self.ruleForm.password="";
											// 				self.ruleForm.name = "";
											// 				self.ruleForm.contactName = "";
											// 				self.ruleForm.email = "";
											// 				self.rAccount = "";
											// 			self.$store.commit("userDialog",{userDialogNum:3,flag:false,fresh:store.state.fresh});
											// 	}
											// });
							}

					},
					// 根据角色名获取角色id
					getRoleId(roleName){
						let id =  store.state.readUser.role.filter(function(item,index){
							if(item.name==roleName){
								return item.id;
							}
						});
						return id;
					},
					// 取消添加用户弹出框
					close(formName){
						this.$store.commit("userDialog",{userDialogNum:1,flag:false});
						this.$refs[formName].resetFields();

						this.ruleForm.password="";
						this.ruleForm.name = "";
						this.ruleForm.contactName = "";
						this.ruleForm.email = "";
						this.rAccount = "";
					},
			    //弹出框关闭前的确认
			    handleClose(done) {
						console.log(1111111111);
						this.$store.commit("userDialog",{userDialogNum:1,flag:false});
						this.$refs['ruleForms'].resetFields();
						this.ruleForm.password="";
						this.ruleForm.name = "";
						this.ruleForm.contactName = "";
						this.ruleForm.email = "";
						this.rAccount = "";
					},
					openUserDialog(){
						 this.$store.commit("userDialog",{userDialogNum:1,flag:true});
					},
					// 检查用户名是否存在
					checkName(){
						var self = this;
						console.log(store.state.userDialogNum);
						
						if(store.state.userDialogNum==1){
							self.$axios.get(`/users/checkName/${self.ruleForms.name}`).then(function(res){
								if(!res.data){
										self.$message({
											message: '用户已存在，请重新输入！',
											type: 'error'
										}); 
								}
							})
						}
					},
					get(){
						let self = this;
						self.$axios.get(`/roles/${this.roleName}`).then(function(res){
							if(/任务审核/g.test(res.data.menus)){
									self.rAccountFlag = true;
									self.$axios.get(`/users/linked`).then(function(res){
										console.log(res);
										self.ruleForm.rAccount = res.data;
									});
							}else{
									self.rAccountFlag = false;
							}
						});
					}

		  }

	}
</script>

<style>
</style>
