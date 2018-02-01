<template>
    <div class="table">
        <!--<div class="crumbs">-->
            <!--<el-breadcrumb separator="/">-->
                <!--<el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>-->
                <!--<el-breadcrumb-item>基础表格</el-breadcrumb-item>-->
            <!--</el-breadcrumb>-->
        <!--</div>-->
        <div class="handle-box">
                <div>
                    <span>每页显示：</span>
                    <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                        <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                    </el-select>
                </div>
                <div>
                    <el-input v-model="select_word" placeholder="用户ID或名称搜索" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" >
            <el-table-column prop="id" label="用户ID" width="100" ></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="name" label="用户名"  width="150">
            </el-table-column>
            <el-table-column prop="roleName" label="角色权限" width="300">
            </el-table-column>
            <el-table-column prop="linked" label="关联账号"  >
                <template slot-scope="scope">
                    <span>{{scope.row.linked |  rAccountf}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="opertion" width="320">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope, scope.row)" >查看</el-button>
                    <el-button size="small" type="danger"
                               @click="handleUpdate(scope.$index, scope.row)" >修改</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
                    <template v-if="scope.row.status==0">
                       <el-button size="small" type="danger"
                               @click="handleStop(scope.$index, scope.row)" >暂停</el-button>
                    </template>
                    <template v-else>
                       <el-button size="small" type="danger"
                               @click="handleStop(scope.$index, scope.row)" >启用</el-button>
                    </template>

                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">启用</span>
                    <span v-else>暂停</span>
                </template>
            </el-table-column>

        </el-table>
        <!--<el-button type="primary" icon="delete" class="handle-del mr10 butMargin" @click="delAll">批量删除</el-button>-->
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                @size-change="pageSizeChange"
                layout="prev, pager, next"
                :total="total"
                :page-size="select_per"
                :page-sizes="page_sizes"
                >
            </el-pagination>
        </div>
         <!--
            添加和修改后刷新列表的解决方法：
                利用Vuex的状态的改变，然后使用计算属性监听状态的变化，实现跨组件调用方法。

            目前还没有想到更好的方式，先这样实现功能把！
         -->
        <div v-show="false">{{refresh}}</div>
        <!-- 修改的dialog -->
        <el-dialog
			  :visible.sync="userUpdatedialogVisible"
			  width="20%"
			  :before-close="handleClose">
			  <el-form :model="ruleForms" :rules="rules"  ref="ruleForms" label-width="100px">
				  <el-form-item label="用户名:" prop="name">
				    <el-input v-model="ruleForms.name"  @blur="checkName" ></el-input>
				  </el-form-item>
				  <el-form-item label="密码:" prop="password" v-if="false">
				    <el-input type="password" v-model="ruleForms.password" ></el-input>
				  </el-form-item>
				  <el-form-item label="角色:" prop="roleName">
				    <el-select v-model="ruleForms.roleName"  @change="getAccount">
				      <el-option
				      	v-for='item in ruleForms.role'
				      	:key="item.id"
				      	:label="item.name"
				      	:value="item.id"
				      	></el-option>
				    </el-select>
				  </el-form-item>
				  <!--
				  	关联账号这个控件需要根据后台返回的数据进行显示，目前先不显示出来
				  -->
				  <el-form-item label="关联账号:" prop="rAccount" v-if="rAccountFlag">
				    <el-select v-model="ruleForms.rAccount" placeholder="请选择关联账号（可多选）" multiple>
				      <el-option
				      	v-for="item in ruleForms.accounts"
				      	:key="item.id"
				      	:label="item.name"
				      	:value="item.id"
				      	></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item label="联系人:" prop="contactName">
				    <el-input  v-model="ruleForms.contactName" ></el-input>
				  </el-form-item>
				  <el-form-item label="Email:" prop="email">
				    <el-input  v-model="ruleForms.email" ></el-input>
				  </el-form-item>
				</el-form>
			  <!--弹出框的取消/保存部分-->
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="close('ruleForms')">取 消</el-button>
			    <el-button type="primary" @click="submitForm('ruleForms')">保 存</el-button>
			  </span>
			</el-dialog>
    </div>
</template>

<script>
// 这里引入状态管理模块
  import store from "../../../store/store";
    export default {

        data() {
            var validName = function(rule,value,callback){
				  if(!value){
						callback(new Error('请输入用户名'));
					}else{
                        if(value.length>50){
                            callback(new Error('长度不能超过50'))
                        }else{
                            if(/^[a-zA-Z0-9_]+$/.test(value)==false){
                                callback(new Error('只能填写字母、数字、下划线'))
                            }else{
                                callback();
                            }
                        }

					}
			};
			var validPass = function(rule,value,callback){
				  if(!value){
						callback(new Error('请输入密码'));
					}else{
                        if(value.length>6&&value.length<16){
                            if(/^[a-zA-Z0-9_]+$/.test(value)==false){
								callback(new Error('只能填写字母、数字、下划线'))
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('请输入6-16位'))
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
                console.log(value,"valllllllllllll");
				if(value.length==0){
						callback(new Error('请选择关联账号（可多选）'));
				}else{
						callback();
				}

			}
            return {
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
                total:1,
                select_per:10,
                select_word: '',

                is_search: false,
                page_sizes:[5,10,15,20,50],

                userUpdatedialogVisible:false,
                ruleForms:{
                    name: '',
		            role: [],
			        contactName:'',
                    email: '',
                    password:'',
                    roleName:"",
                    rAccount:[],
                    accounts:[]
                },
                // 角色的默认值
                roleName:"",
                // 是否显示关联账号
                rAccountFlag:false,
                // 关联账号的值
                rAccount:[],
                // 保存当前修改的用户名和id
                updateId:"",
                updateName:"",

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
            }
        },
        watch:{
            select_word:function(){
                this.getData();
            }
        },
        created(){
            let self = this;
            // 获取所有的关联账号
            self.$axios.get(`/users/linked`).then(function(res){
                        console.log(res);
                        self.ruleForms.accounts = res.data;
            });
            // 获取所有的角色
            self.$axios.get('/roles/all').then(function(res){
                        self.ruleForms.role = res.data;
            });
            this.getData();
        },
        filters:{
            rAccountf(value){
                let a = value.map(function(item,index){
                    return item.name;
                });
                return a.join(',');
            }
        },
        computed: {
//          数据更新
            data(){
                const self = this;
                return self.tableData;
            },
            // 添加修改后表格的刷新
            refresh(){
                this.getData();
                return this.$store.state.fresh;
            },

        },
        methods: {
            //          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },
            //          每页显示条数
            pageSizeChange(val){
                this.select_per = val;
                this.getData();
            },
            //          分页按钮
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },

            //          获取数据
            getData(){
                let self = this;
                if(self.$store.state.token){
                    
                    self.$axios.get(`/users?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}`).then((res) => {
                        self.total = res.data.pagination.total==0?1:res.data.pagination.total;;
                        self.tableData = res.data.data;
                    })
                }else{
                    return false;
                }
            },
//          搜索
            search(){
                this.is_search = true;
                this.getData();
            },
            // 查看用户信息
            handleEdit(index, row) {
                let self = this;
                this.$axios.get(`/users/${row.id}`).then(function(res){
                    if(res.status == 200){
                        self.$store.commit('readUsers',res.data);
                        self.$store.commit("userDialog",{userDialogNum:2,flag:true});
                    }else{
                        return false;
                    }
                });
            },
            // 修改信息
            handleUpdate(index, row){
                let self = this;
                self.userUpdatedialogVisible = true;
                self.updateId = row.id;
                // 关联账号的默认选项
                function rAccountDefault(linked){
                    let arr = linked.map(function(item){
                        return item.name;
                    });
                    return arr;
                };
                // 获取修改用户的信息
                self.$axios.get(`/users/${row.id}`).then(function(res){
                    console.log(res);
                    if(res.status == 200){
                        let user = res.data;
                        self.$store.commit('readUsers',res.data);
                        // self.$store.commit("userDialog",{userDialogNum:4,flag:true,updateId:row.id});
                        self.ruleForms.name = user.name;
                        self.updateName  = user.name;
                        self.ruleForms.roleName = user.roleName;
                        // 根据角色的id来判断此角色是否有任务审核的权限
                        // self.$axios.get(`/roles/${user.roleId}`).then(function(data){
                        //     console.log(data);
						// 	if(/任务审核/g.test(data.data.menus)){
						// 			self.rAccountFlag = true;
						// 	}else{
						// 			self.rAccountFlag = false;
						// 	}
                        // });
                        self.getAccount(user.roleId);
                        self.ruleForms.rAccount = rAccountDefault(user.linked);
                        self.ruleForms.contactName = user.contactName;
                        self.ruleForms.email = user.email;
                    }else{
                        return false;
                    }
                });

            },
            submitForm(formName){
                let self = this;
                let arr = [];

                // 判断在提交时，是否有关联账号，如果没有就清除之前的关联账号
                if(!self.rAccountFlag&&self.ruleForms.rAccount.length!=0){
                    self.ruleForms.rAccount = [];
                }
                // 将文字的关联账号转为对应的id
                self.ruleForms.rAccount.forEach(function(item){
                    if(typeof item == "string"){
                        let b =  self.ruleForms.accounts.filter(function(item1){
                            return item1.name == item;
                        });
                        if(b.length!=0){
                            arr.push(b[0].id);
                        }
                    }else{
                        arr.push(item);
                    }
                });
                let set = new Set();
                arr.forEach(function(i){set.add(i)});

                // 在提交前做重复校验
                self.$axios.get(`/users/${self.updateId}`).then(function(res){
                    // 当name与当前修改的name一样时不做检验
                    if(self.ruleForms.name == res.data.name){
                        self.$refs[formName].validate((valid)=>{
                            if(valid){
                                self.$axios.put(`/users/${self.updateId}`,{
                                    name:self.ruleForms.name,
                                    roleId:self.ruleForms.roleName==store.state.readUser.roleName?self.getRoleId(self.ruleForms.roleName)[0].id:self.ruleForms.roleName,
                                    linkIds:Array.from(set).join(','),
                                    contactName:self.ruleForms.contactName,
                                    email:self.ruleForms.email
                                }).then(function(res){
                                    if(res.status == 200){
                                        self.$message({
                                            message: '用户修改成功！',
                                            type: 'success'
                                        });
                                        self.ruleForms.name = "";
                                        self.ruleForms.contactName = "";
                                        self.ruleForms.email = "";
                                        self.ruleForms.rAccount = [];
        
                                        self.userUpdatedialogVisible = false;
                                        self.getData();
                                        // self.$store.commit("userDialog",{userDialogNum:3,flag:false,fresh:store.state.fresh});
                                    }
                                });
                            }
                        });
                    }else{
                        self.$refs[formName].validate((valid)=>{
                            if(valid){
                                self.$axios.get(`/users/checkName/${self.ruleForms.name}`).then(function(res){
                                        if(!res.data){
                                                self.$message({
                                                    message: '用户已存在，请重新输入！',
                                                    type: 'error'
                                                });
                                        }else{
                                            self.$axios.put(`/users/${self.updateId}`,{
                                                name:self.ruleForms.name,
                                                roleId:self.ruleForms.roleName==store.state.readUser.roleName?self.getRoleId(self.ruleForms.roleName)[0].id:self.ruleForms.roleName,
                                                linkIds:Array.from(set).join(','),
                                                contactName:self.ruleForms.contactName,
                                                email:self.ruleForms.email
                                            }).then(function(res){
                                                console.log(res,111111);
                                                if(res.status == 200){
                                                    self.$message({
                                                        message: '用户修改成功！',
                                                        type: 'success'
                                                    });
        
                                                    self.ruleForms.name = "";
                                                    self.ruleForms.contactName = "";
                                                    self.ruleForms.email = "";
                                                    self.ruleForms.rAccount = [];
        
                                                    self.userUpdatedialogVisible = false;
                                                    self.getData();
                                                    // self.$store.commit("userDialog",{userDialogNum:3,flag:false,fresh:store.state.fresh});
                                                }
                                            });
                                        }
                                })

                            }
                        });
                    }
                })

                
            },
            // 根据角色名获取角色id
            getRoleId(roleName){
                let id =  this.ruleForms.role.filter(function(item,index){
                    if(item.name==roleName){
                        return item.id;
                    }
                });
                return id;
            },
            // 删除
            handleDelete(index, row) {
                let self = this;
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.delete(`/users/${row.id}`).then(function(res){
                            if(res.status == 200 || res.status == 204){
                                // self.$store.commit('readUsers',res.data);
                                // self.$store.commit("userDialog",{userDialogNum:3,flag:true});
                                self.$message({
                                    message: '删除用户成功！',
                                    type: 'success'
                                });
                                self.getData();
                            }else{
                                return false;
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                });
            },
            // 冻结
            handleStop(index, row){
                if(row.status==0){
                    /*
                        未冻结，启用状态，调用冻结接口
                        /users/frozen/{id}
                    */
                    var self = this;
                    self.$confirm('确定冻结该用户?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.put(`/users/frozen/${row.id}`).then(function(res){
                            if(res.status==200){
                                self.getData();
                                self.$message({
                                    type: 'success',
                                    message: '冻结成功!'
                                });
                            }
                        });
                    }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '已取消冻结'
                        });
                    });
                }else{
                    /*
                        冻结，未启用状态，调用解除冻结接口
                        /users/unfroze/{id}
                    */
                    var self = this;
                    this.$confirm('是否启用该用户?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.put(`/users/unfrozen/${row.id}`).then(function(res){
                            if(res.status==200){
                                self.getData();
                                self.$message({
                                    type: 'success',
                                    message: '启用成功!'
                                });
                            }

                        });

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消解除冻结'
                        });
                    });

                }
            },
            handleClose(){
                this.userUpdatedialogVisible = false;
            },
            // 取消添加用户弹出框
            close(formName){
                        // this.$store.commit("userDialog",{userDialogNum:1,flag:false});
                        this.userUpdatedialogVisible = false;
						this.$refs[formName].resetFields();
                        
                        this.ruleForms.password = "";
						this.ruleForms.name = "";
						this.ruleForms.contactName = "";
						this.ruleForms.email = "";
						this.rAccount = "";
            },
            // 检查用户名是否存在
					checkName(){
						var self = this;
						// var url = "";
						// if(store.state.userDialogNum==1){
						// 	url =  `/users/checkName/${self.ruleForms.name}`;
						// }else if(store.state.userDialogNum==3){
						// 	url =  `/users/checkName/${store.state.updateId}/${self.ruleForms.name}`
						// }
						// if(store.state.userDialogNum!=3){
                        if(self.ruleForms.name == self.updateName){
                            return false;
                        }else{
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
                    getAccount(a){
                        let self = this;
                        // let r ;
                        // if(isNaN(this.roleName)){
                        //     r = self.getRoleId(this.roleName)[0].id;
                        // }else{
                        //     r = self.ruleForms.roleName;
                        // }
                        let roleId;
						console.log(a);
						if(a){
							roleId = a;
						}else{
							roleId = this.ruleForms.roleName;
						}
						self.$axios.get(`/roles/${roleId}`).then(function(res){
							if(/任务审核/g.test(res.data.menus)){
									self.rAccountFlag = true;
							}else{
									self.rAccountFlag = false;
							}
						});
					}
        }
    }
</script>

<style scoped>
    .table{
        margin-top:10px;
        min-width: 1200px;
    }
    .handle-box{
        margin-bottom: 5px;
        display:flex;
        justify-content:space-between;
        min-width: 1200px;
        
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
    /*分页*/
    .pagination{
        float:right;
        margin:5px 0px;
    }
    .butMargin{
        margin:5px 0px;
    }
</style>
