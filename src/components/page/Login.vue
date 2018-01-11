<template>
    <div class="login-wrap">
        <div class="ms-title">Gemii任务系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名" error="true"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填!</p> -->
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
        			callback(new Error("用户名错误!"));
        		}else{
        			callback();
        		}
        	}
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { validator:checkName,trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
            
           
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
						this.$axios.post("/users/login",{
								username:self.ruleForm.username,
                                password:self.ruleForm.password
							}).then(function(res){
                                if(res.data.token){
                                    console.log(res.data);
                                    // 将拿到的token存放到状态管理对象里面
                                    self.$store.commit(types.LOGIN,res.data);
                                    // 然后跳转页面，需要做用户验证
                                    self.$router.push('/home');
                                }else{
                                    self.$message({
                                        message: res.message,
                                        type: 'warning'
                                    });
                                }
						    },function(err){
                                self.$message({
                                        message: "服务器未响应！",
                                        type: 'warning'
                                    });                               
                            }).catch(function(error){
                                console.log(error);
                            });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
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