<template>
    <div class="login-wrap">
        <div class="ms-title">Gemii任务系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:14px;line-height:30px;color:red;" v-if="errorFlag">{{errorMsg}}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import * as types from "../../store/types";
    export default {
        data: function(){
        	 var checkName = (rule, value, callback)=>{
        		if(value === ''){
        			callback(new Error("用户名不能为空!"));
        		}else{
        			callback();
        		}
            };
            var checkPass = (rule, value, callback)=>{
                if(value === ''){
        			callback(new Error("密码不能为空!"));
        		}else{
        			callback();
        		}
            }
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                errorMsg:"",
                errorFlag:false,
                rules: {
                    username: [
                        { validator:checkName,trigger: 'blur'}
                    ],
                    password: [
                        { validator:checkPass, trigger: 'blur' }
                    ]
                }
            }
            
           
        },
        methods: {
            submitForm(formName) {
                        const self = this;
                // self.$refs[formName].validate((valid) => {
                //     if (valid) {
						this.$axios.post("/users/login",{
								username:self.ruleForm.username,
                                password:self.ruleForm.password
							}).then(function(res){
                                if(res.data.token){
                                    self.errorFlag = false;
                                    localStorage.setItem("ms_username",res.data.user.name);
                                    // 将拿到的token存放到状态管理对象里面
                                    self.$store.commit(types.LOGIN,res.data);
                                    // 然后跳转页面，需要做用户验证
                                    self.$router.replace('/home');
                                }else{
                                    
                                }
						    },function(err){
                                self.errorFlag = true;
                                switch(err.code){
                                    case 1:
                                        self.errorMsg = err.msg;
                                        break;
                                    case 2:
                                        self.errorMsg = err.msg;
                                        break;
                                    case 3:
                                        self.errorMsg = err.msg;
                                        break;
                                    case 4:
                                        self.errorMsg = err.msg;
                                        break;
                                }
                            }).catch(function(error){
                                console.log(error);
                                console.log(1111111);
                                
                            });

                //     } else {
                //         console.log('error submit!!');
                //         return false;
                //     }
                // });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>