<template xmlns="">
    <div>
        <el-form  label-width="150px" :rules="rules" :model="passForm" ref="passForm" >
            <el-form-item label="密码:" prop="pass">
                <el-input  placeholder="请输入密码" v-model="passForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newpass1">
                <el-input  placeholder="新密码" v-model="passForm.newpass1"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码:" prop="newpass2">
                <el-input  placeholder="再次输入新密码" v-model="passForm.newpass2"></el-input>
            </el-form-item>
            <el-form-item  >
                <el-button type="primary" @click="submitForm('passForm')">确 定</el-button>
                <el-button type="primary" @click="close('passForm')">取 消</el-button>
                
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import store from '../../store/store'
import * as types from '../../store/types'
    export default {
        data(){
            var checkNewpass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.passForm.newpass1) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var checkPassword = function(rule,value,callback){
                if(!value){
                    callback(new Error('请输入密码'));
                }else{
                    if(value.length<6||value.length>16){
                        callback(new Error('请输入6-16位'));
                    }else{
                        if(/^[a-zA-Z0-9_]+$/.test(value)==false){
                            callback(new Error('只能填写字母、数字、下划线'))
                        }else{
                            callback();
                        }
                    }
                }
            }
            return{
                passForm:{
//                    密码
                    pass:"",
//                    新密码
                    newpass1:"",
//                    再次输入的新密码
                    newpass2:""
                },
//                校验规则
                rules: {
                    pass: [
                        { required: true, validator:checkPassword, trigger: 'blur' }
                    ],
                    newpass1: [
                        { required: true, validator:checkPassword, trigger: 'blur' }
                    ],
                    newpass2: [
                        {required: true, validator:checkNewpass,trigger: 'blur'}
                    ]
                },
            }
        },

        methods:{
            checkNewpass(){
                const self = this;
                return self.passForm.newpass1==self.passForm.newpass2;
            },
             submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    console.log(self.$refs);
                    console.log(valid);
                    if (valid) {
						self.$axios.put("/users/changePassword",{
								name:localStorage.getItem("ms_username"),
                                oldPass:self.passForm.pass,
                                newPass:self.passForm.newpass1,
							}).then(function(res){
                                    console.log(res,"密码修改成功");
                                    // 然后跳转页面，需要做用户验证
                                    self.$store.commit(types.LOGOUT);
                                    self.$router.push('/login');
                                    self.$message({
                                        message: "修改密码成功！",
                                        type: 'success'
                                    });
						    },function(err){
                                    console.log(err,'密码修改失败');
                                    self.$message({
                                            message: "修改密码失败！请重新输入！",
                                            type: 'error'
                                    });
                            });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 取消密码修改，返回上一级
            close(){
                const self = this;
                self.$router.go(-1);
            }


        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }
    /* .item {
        margin-bottom: 18px;
    } */
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 500px;
        margin-bottom:20px;
        margin-right:10px;
        float: left;
    }
    .box-card:last-child{
        margin-bottom:0px;
    }
    .box-card:first-child{
        margin-left:0px;
    }
    .el-form-item .el-form-item{
        margin-bottom:20px
    }
    .el-form-item .el-form-item .el-form-item__content{
        margin-left:110px !important;
    }


    .preview .box-card{
        width:100%;
    }
    /* 卡片式链接预览 */
    .preview .item{
        width:100%;
        height:100%;
        display: flex;
        justify-content: space-between;
    }
    .preview .item .last{
        width:35%;
    }
    .preview .item .first{
        width:65%;
    }
    .preview .item .first h2,.preview .item .first p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .preview .item img{
        width:100%;
        height:100%;
    }
    /* 小程序预览 */
    .preview .item1{
        width:100%;
        height:100%;
        display: flex;
        justify-content: space-between;
        flex-direction:column;
    }
    /* .preview .item1 .last{
        width:35%;
    }
    .preview .item1 .first{
        width:65%;
    }  */
    .preview .item1 .first h2,.preview .item1 .first p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .preview .item1 img{
        width:100%;
        height:100%;
    }
    .el-input{
        width:80%;
    }
</style>
