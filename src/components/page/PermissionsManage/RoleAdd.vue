<template>
	<div>
		<el-button type="primary" @click="openRoleDialog('ruleForms')">+添加角色</el-button>
    	<!--
    		添加用户的弹出框部分
    	-->
	    <el-dialog
			  :visible.sync="roledialogVisible"
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
				  <el-form-item label="角色名" prop="name">
				    <el-input v-model="ruleForms.name" :readonly="disabled" @blur="checkName"></el-input>
				  </el-form-item>
				  <el-form-item label="角色权限" prop="menus">
				    <el-checkbox-group v-model="ruleForm.menus">
				      <el-checkbox v-for="permi in ruleForm.permissions" :label="permi.id"  :key="permi.id" :disabled="disabled">{{permi.name}}</el-checkbox></br>
				    </el-checkbox-group>
				  </el-form-item>
			</el-form>
			<!--弹出框的取消/保存部分-->			
			<span slot="footer" class="dialog-footer" v-if="this.$store.state.roleDialogNum==1||this.$store.state.roleDialogNum==3">
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
	// 这里引入状态管理模块,当然也可以不引入，使用this.$store即可
    import store from "../../../store/store";
	export default {
		data(){
			var validName = function(rule,value,callback){
				    if(!value){
						callback(new Error('请输入角色名'));
					}else{
						if(/^[a-zA-Z0-9_]{1,}$/.test(value)==false){
								callback(new Error('只能填写字母、数字、下划线'))
						}else{
							callback();
						}
					}
			};
			return {
					//是否显示弹出框
					dialogVisible: false,
					//表单数据
					ruleForm: {
							name: '',
							rescs: [],
							//多选数据
							menus: [],
							// 存放所有权限
							permissions:[],
		            },
					//表单控件验证规则
					rules: {
						name: [
							{ required: true, trigger: 'blur',validator:validName }
				  		],
						menus:[
							{ type: 'array', required: true, message: '请至少选择一个角色权限', trigger: 'change'}
						]
		      		},
					isIndeterminate: true,
					// 只读
					disabled:false,
				}
			},
				computed:{
					    // 由用户添加按钮和查看按钮触发弹出框
							roledialogVisible:{
								 get(){
										var self = this;
										// 获取所有权限
										self.$axios.get('/roles/menus').then(function(res){
											console.log(res);
											
											if(res.status == 200){
												self.ruleForm.permissions = res.data;
											}else{
												return false;
											}
										});
										return store.state.roleDialog;
								 },
								 set(){
											
								 }
							},
							// 当状态管理器中的状态改变 判断由哪个操作按钮触发弹出框并显示对应的样式
							ruleForms:{
								get(){
									if(store.state.roleDialogNum==1){
											this.disabled = false;
											this.ruleForm.name = "";
											this.ruleForm.menus = [];
										    return this.ruleForm;
									}else if(store.state.roleDialogNum==2){
										    this.ruleForm.name = store.state.readRole.name;
											this.ruleForm.menus = this.permis;
											this.disabled = true;
											return this.ruleForm;
									}else if(store.state.roleDialogNum==3){
											this.ruleForm.name = store.state.readRole.name;
											this.ruleForm.menus = this.permis;
											this.disabled = false;
											return this.ruleForm;
									}else{
											this.disabled = false;
											return this.ruleForm;
									}
									
								},
								set(){}
							},
              				// 点击查看和修改时，复选框的默认选项。将此角色已有的权限标记为选中状态。
							permis:{
								get(){
									var r = [];
									this.ruleForm.permissions.forEach(function(item,index){
										    if(store.state.readRole){
												var result1 = store.state.readRole.rescs.filter(function(item1,index1){
														return item.id == item1.id;
												});
												if(result1.length != 0){
														r.push(result1[0].id);
												}
											}
											
									});
									return r;
								},
								set(){}
							},
							// 将权限的id数组转换为字符串格式 '1,3,4,6'
							menuIds:{
								get(){
									return this.ruleForm.menus.join(",")
								},
								set(){}
							}
				},
		    methods:{
				  //添加用户的保存事件
			    submitForm(formName){
							let users = this.ruleForm;
							var self = this;
							if(store.state.roleDialogNum==1){
									self.$refs[formName].validate((valid)=>{
											if(valid){
													// 用户添加 
													self.$axios.get(`/roles/checkName/${self.ruleForms.name}`).then(function(res){
														if(!res.data){
																self.$message({
																	message: '角色已存在，请重新输入！',
																	type: 'error'
																}); 
														}else{
															self.$axios.post('/roles',{
																	name:users.name,
																	menuIds:self.menuIds
															}).then(function(res){
																if(res.status == 200 || res.status==201){
																	self.$message({
																		message: '角色添加成功！',
																		type: 'success'
																	});
																	self.ruleForm = {name: '',rescs: [],menus: [],permissions:[],};
																	self.$store.commit("roleDialog",{roleDialogNum:1,flag:false,fresh:store.state.fresh});
																}else{
																	self.$message.error('角色添加失败！');
																}

															});
														}
													})
													
											}else{
												return false;
											}
									})
							}else if(store.state.roleDialogNum==2){
										self.$store.commit("roleDialog",{roleDialogNum:2,flag:false});
							}else if(store.state.roleDialogNum==3){
											self.$axios.get(`/roles/${store.state.updateRoleId}`).then(function(res){
												if(self.ruleForm.name==res.data.name){
															self.$axios.put(`/roles/${store.state.updateRoleId}`,{
																	name:self.ruleForm.name,
																	menuIds:self.menuIds
															}).then(function(res){
																if(res.status == 200){
																	self.$message({
																		message: '角色修改成功！',
																		type: 'success'
																	});
																	self.ruleForm = {name:'',rescs: [],menus: [],permissions:[]};
																	self.$store.commit("roleDialog",{roleDialogNum:3,flag:false,fresh:store.state.fresh});
																}
															});
												}else{
													console.log(self.ruleForm.name);
													self.$axios.get(`/roles/checkName/${self.ruleForm.name}`).then(function(res){
														console.log(res);
														if(!res.data){
																self.$message({
																	message: '角色已存在，请重新输入！',
																	type: 'error'
																}); 
														}else{
															self.$axios.put(`/roles/${store.state.updateRoleId}`,{
																	name:self.ruleForm.name,
																	menuIds:self.menuIds
															}).then(function(res){
																if(res.status == 200){
																	self.$message({
																		message: '角色修改成功！',
																		type: 'success'
																	});
																	self.ruleForm = {name:'',rescs: [],menus: [],permissions:[]};
																	self.$store.commit("roleDialog",{roleDialogNum:3,flag:false,fresh:store.state.fresh});
																}
															});
														}
													})
												}
											});
							}
					},
				// 取消添加用户弹出框
				close(formName){
					this.$store.commit("roleDialog",{roleDialogNum:1,flag:false});
					this.$refs[formName].resetFields();
				},
			    //弹出框叉号关闭前的确认
			    handleClose(done) {
					this.$store.commit("roleDialog",{roleDialogNum:1,flag:false});
				},
				// 弹出框
				openRoleDialog(formName){
					this.$store.commit("roleDialog",{roleDialogNum:1,flag:true});
					// 清空数据，以免上次数据的保留
					this.ruleForm.name = "";
					this.ruleForm.menus = [];
					console.log(this.$refs[formName]);
					if(this.$refs[formName]){
						this.$refs[formName].resetFields();
					}

				},
				// 角色名重复验证
				checkName(){
					var self = this;
					if(store.state.roleDialogNum==1){
						self.$axios.get(`/roles/checkName/${self.ruleForms.name}`).then(function(res){
							console.log(res);
							if(!res.data){
									self.$message({
										message: '角色已存在，请重新输入！',
										type: 'error'
									}); 
							}
						})
					}
				}
		    }
		
	}
</script>

<style scoped>
	.el-checkbox{
		display: block;
	}
	.el-checkbox + .el-checkbox{
		margin-left:0px;
	}
</style>